/**
 * Filename: routes.ts
 *
 * Desc: Routing/Services for Backend Server
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import {
  BudgetType,
  Category,
  Transaction,
  CategoriesData,
} from "../types/interfaces";
import { categories } from "../data/categories";
import { transactions } from "../data/transactions";
import { systemPrompt, formatFinancialData } from "../prompt/prompts";
import OpenAI from "openai";

const router = express.Router();

// Lazy initialization to ensure env vars are loaded
let openai: OpenAI;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return openai;
}

function isValidBudgetType(type: string): type is BudgetType {
  return type === "personal" || type === "shared" || type === "family";
}

function findAndUpdateCategory(
  budgetType: BudgetType,
  categoryId: string,
  updateFn: (category: Category) => void
): Category | null {
  const budgetData = categories[budgetType];

  for (const group of budgetData) {
    for (const category of group.categories) {
      if (category.id === categoryId) {
        updateFn(category);
        return category;
      }
    }
  }
  return null;
}

router.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng" });
});

router.get("/api/categories/:budgetType", (req: Request, res: Response) => {
  const { budgetType } = req.params;

  if (!isValidBudgetType(budgetType)) {
    res.status(400).json({
      error: "Invalid budget type.",
    });
    return;
  }

  res.json(categories[budgetType]);
});

router.get("/api/transactions", (req: Request, res: Response) => {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateComparison =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    // If dates are the same, sort by ID (newer transactions have higher IDs)
    if (dateComparison === 0) {
      return Number(b.id) - Number(a.id);
    }
    return dateComparison;
  });
  res.json(sortedTransactions);
});

let transactionIdCounter: number = 8; // start at 8 since we have some dummy data already

router.post("/api/transactions", (req: Request, res: Response) => {
  const { date, payee, categoryId, amount, notes, type, budgetType } = req.body;

  if (!date || !payee || !amount || !type) {
    res.status(400).json({
      error: "Missing required fields.",
    });
    return;
  }

  if (type !== "expense" && type !== "income") {
    res.status(400).json({
      error: "Invalid Type: Must be 'expense' or 'income'.",
    });
    return;
  }

  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({
      error: "Amount must be a non-negative number.",
    });
    return;
  }

  // Create new transaction
  const newTransaction: Transaction = {
    id: String(transactionIdCounter++),
    date,
    payee,
    categoryId: categoryId || "uncategorized",
    amount,
    type,
    notes: notes || "",
  };

  transactions.push(newTransaction);

  if (
    categoryId &&
    type === "expense" &&
    budgetType &&
    isValidBudgetType(budgetType)
  ) {
    findAndUpdateCategory(budgetType, categoryId, (category) => {
      category.spent += amount;
      category.available = category.budgeted - category.spent;
    });
  }

  // Add for 'income'
  if (
    categoryId &&
    type === "income" &&
    budgetType &&
    isValidBudgetType(budgetType)
  ) {
    findAndUpdateCategory(budgetType, categoryId, (category) => {
      category.available += amount;
    });
  }

  res.status(201).json({
    message: "Transaction added succesffuly",
    transaction: newTransaction,
  });
});

router.delete("/api/transactions/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const index = transactions.findIndex((transaction) => transaction.id === id);

  if (index === -1) {
    res.status(404).json({
      error: "Transaction not found.",
    });
    return;
  }

  /**
   * FIXME: Currently when we delete a transaction, we only
   * update the array itself, but we need to undo the amount the transaction
   * added/subtracted from a category/budget
   */

  const deleted = transactions.splice(index, 1)[0];

  res.status(200).json({
    message: "Transaction successfully deleted",
    transaction: deleted,
  });
});

router.put(
  "/api/categories/:budgetType/:categoryId/budget",
  (req: Request, res: Response) => {
    const { budgetType, categoryId } = req.params;
    const { budgeted } = req.body;

    if (!isValidBudgetType(budgetType)) {
      res.status(400).json({
        message: "Invalid budget type.",
      });
      return;
    }

    if (typeof budgeted !== "number" || budgeted < 0) {
      res.status(400).json({
        error: "Expected amount to be positive.",
      });
      return;
    }

    const category = findAndUpdateCategory(
      budgetType,
      categoryId,
      (category) => {
        category.budgeted = budgeted;
        category.available = budgeted - category.spent;
      }
    );

    if (!category) {
      res.status(404).json({
        error: "Category not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Updated budget succesffuly.",
      category,
    });
  }
);

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

router.post("/api/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${systemPrompt}${formatFinancialData(
            categories,
            transactions
          )}`,
        },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
    });

    const responseText =
      completion.choices[0]?.message?.content || "No response generated.";
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("DeepSeek API error:", error);
    res.status(500).json({ error: "AI generation failed." });
  }
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
