/**
 * Filename: analytics.ts
 *
 * Desc: Analytics and summary API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { CategoriesData } from "../types/interfaces";
import { categories } from "../data/categories";
import { transactions } from "../data/transactions";
import { isValidBudgetType } from "./utils";

const router = express.Router();

// Just the total stats of your finances
router.get("/api/summary/:budgetType", (req: Request, res: Response) => {
  const { budgetType } = req.params;

  if (!isValidBudgetType(budgetType)) {
    res.status(404).json({
      message: "Invalid Budget Type.",
    });
    return;
  }

  let totalIncome = 0;
  let totalAvailable = 0;
  let totalBudgeted = 0;
  let totalSpent = 0;

  const budgetData = categories[budgetType as keyof CategoriesData];

  for (let group of budgetData) {
    for (let cat of group.categories) {
      totalAvailable += cat.available;
      totalBudgeted += cat.budgeted;
      totalSpent += cat.spent;
    }
  }

  for (let t of transactions) {
    if (t.type === "income") {
      totalIncome += t.amount;
    }
  }

  res.status(200).json({
    budgetType: budgetType,
    totalIncome: totalIncome,
    totalBudgeted: totalBudgeted,
    totalSpent: totalSpent,
    totalAvailable: totalAvailable,
  });
});

// User financial summarized statistics
router.get("/api/analytics/:budgetType", (req: Request, res: Response) => {
  const { budgetType } = req.params;

  if (!isValidBudgetType(budgetType)) {
    res.status(400).json({
      error: "Invalid budget type.",
    });
    return;
  }

  let totalIncome: number = 0;
  let totalExpenses: number = 0;
  let targetsCompleted: number = 0;
  let criticalTargets: Array<string> = []; // targets that have 0$ available to spend
  let topExpenses: Array<{ name: string; spent: number }> = [];
  let topRemaining: Array<{ name: string; available: number}> = [];
  let mostFrequentCat: string = '';

  for (let t of transactions) {
    if (t.type === "expense") {
      totalExpenses += t.amount;
    } else {
      totalIncome += t.amount;
    }
  }

  const data = categories[budgetType];

  data.forEach((item) => {
    const categoryArr = item.categories;
    categoryArr.forEach((cat) => {
      if (cat.available === cat.budgeted) {
        targetsCompleted++;
      } else if (cat.available < 0) {
        // List of categories who exceed their budget
        criticalTargets.push(cat.name);
      }
    });
  });

  data.forEach((item) => {
    const tmp = [...item.categories].sort((a, b) => b.spent - a.spent);
    const firstEl = tmp[0];
    topExpenses.push({ name: firstEl.name, spent: firstEl.spent });
  });

  const top3Expenses = topExpenses
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  // Categories with most remaining funds
  data.forEach((item) => {
    const tmp = [...item.categories].sort((a, b) => b.available - a.available);
    const firstEl = tmp[0];
    topRemaining.push({ name: firstEl.name, available: firstEl.available });
  });

  const top3Remaining = topRemaining
    .sort((a, b) => b.available - a.available)
    .slice(0, 3);

  // Most frequent category (by number of transactions)
  const categoryCount: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryCount[t.categoryId] = (categoryCount[t.categoryId] || 0) + 1;
    }
  });

  let maxCount = 0;
  let mostFrequentCatId = '';
  Object.entries(categoryCount).forEach(([catId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentCatId = catId;
    }
  });

  // Find the category name from ID
  if (mostFrequentCatId) {
    data.forEach((group) => {
      const foundCat = group.categories.find(cat => cat.id === mostFrequentCatId);
      if (foundCat) {
        mostFrequentCat = foundCat.name;
      }
    });
  }

  // Percentage of income not spent
  const percentageNotSpent = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome) * 100 
    : 0;

  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const averageTransactionAmount = expenseTransactions.length > 0
    ? totalExpenses / expenseTransactions.length
    : 0;

  res.status(200).json({
    budgetType,
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    targetsCompleted,
    criticalTargets,
    top3Expenses,
    top3Remaining,
    mostFrequentCategory: mostFrequentCat,
    percentageNotSpent: Math.round(percentageNotSpent * 100) / 100, // Round to 2 decimals
    averageTransactionAmount: Math.round(averageTransactionAmount * 100) / 100,
    totalTransactions: transactions.length,
    expenseTransactions: expenseTransactions.length,
  });
});

export default router;
