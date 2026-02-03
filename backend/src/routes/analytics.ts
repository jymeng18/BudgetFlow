/**
 * Filename: analytics.ts
 *
 * Desc: Analytics and summary API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { supabase } from "../server";
import { authenticateUser } from "../middleware/authMiddleware";
import { isValidBudgetType } from "./utils";

const router = express.Router();

// Just the total stats of your finances
router.get(
  "/api/summary/:budgetType",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { budgetType } = req.params;
    const userId = req.userId;

    if (!isValidBudgetType(budgetType)) {
      res.status(404).json({
        message: "Invalid Budget Type.",
      });
      return;
    }

    try {
      // Get categories for this budget type
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("budgeted, spent, available")
        .eq("user_id", userId)
        .eq("budget_type", budgetType);

      if (catError) {
        res.status(500).json({ error: catError.message });
        return;
      }

      // Get all transactions to calculate balance
      const { data: transactionsData, error: txError } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", userId);

      if (txError) {
        res.status(500).json({ error: txError.message });
        return;
      }

      let totalIncome = 0;
      let totalExpenses = 0;
      let totalAvailable = 0;
      let totalBudgeted = 0;
      let totalSpent = 0;

      for (const cat of categoriesData) {
        totalAvailable += parseFloat(cat.available);
        totalBudgeted += parseFloat(cat.budgeted);
        totalSpent += parseFloat(cat.spent);
      }

      for (const t of transactionsData) {
        if (t.type === "income") {
          totalIncome += parseFloat(t.amount);
        } else if (t.type === "expense") {
          totalExpenses += parseFloat(t.amount);
        }
      }

      const balance = totalIncome - totalExpenses;

      res.status(200).json({
        budgetType: budgetType,
        balance: balance,
        totalBudgeted: totalBudgeted,
        totalSpent: totalSpent,
        totalAvailable: totalAvailable,
      });
    } catch (error) {
      console.error("Summary error:", error);
      res.status(500).json({ error: "Failed to fetch summary" });
    }
  }
);

// User financial summarized statistics
router.get(
  "/api/analytics/:budgetType",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { budgetType } = req.params;
    const userId = req.userId;

    if (!isValidBudgetType(budgetType)) {
      res.status(400).json({
        error: "Invalid budget type.",
      });
      return;
    }

    try {
      // Get categories for this budget type
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .eq("budget_type", budgetType);

      if (catError) {
        res.status(500).json({ error: catError.message });
        return;
      }

      // Get all transactions
      const { data: transactionsData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);

      if (txError) {
        res.status(500).json({ error: txError.message });
        return;
      }

      let totalIncome = 0;
      let totalExpenses = 0;
      let targetsCompleted = 0;
      let criticalTargets: string[] = [];
      let topExpenses: { name: string; spent: number }[] = [];
      let topRemaining: { name: string; available: number }[] = [];
      let mostFrequentCat = "";

      // Calculate income and expenses from transactions
      for (const t of transactionsData) {
        if (t.type === "expense") {
          totalExpenses += parseFloat(t.amount);
        } else {
          totalIncome += parseFloat(t.amount);
        }
      }

      // Analyze categories
      for (const cat of categoriesData) {
        const budgeted = parseFloat(cat.budgeted);
        const available = parseFloat(cat.available);
        const spent = parseFloat(cat.spent);

        if (available === budgeted) {
          targetsCompleted++;
        } else if (available < 0) {
          criticalTargets.push(cat.name);
        }

        topExpenses.push({ name: cat.name, spent });
        topRemaining.push({ name: cat.name, available });
      }

      const top3Expenses = topExpenses
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 3);

      const top3Remaining = topRemaining
        .sort((a, b) => b.available - a.available)
        .slice(0, 3);

      // Most frequent category (by number of transactions)
      const categoryCount: Record<string, number> = {};
      transactionsData.forEach((t) => {
        if (t.type === "expense" && t.category_id) {
          categoryCount[t.category_id] = (categoryCount[t.category_id] || 0) + 1;
        }
      });

      let maxCount = 0;
      let mostFrequentCatId = "";
      Object.entries(categoryCount).forEach(([catId, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostFrequentCatId = catId;
        }
      });

      // Find the category name from ID
      if (mostFrequentCatId) {
        const foundCat = categoriesData.find((cat) => cat.id === mostFrequentCatId);
        if (foundCat) {
          mostFrequentCat = foundCat.name;
        }
      }

      // Percentage of income not spent
      const percentageNotSpent =
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0;

      const expenseTransactions = transactionsData.filter(
        (t) => t.type === "expense"
      );
      const averageTransactionAmount =
        expenseTransactions.length > 0
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
        percentageNotSpent: Math.round(percentageNotSpent * 100) / 100,
        averageTransactionAmount: Math.round(averageTransactionAmount * 100) / 100,
        totalTransactions: transactionsData.length,
        expenseTransactions: expenseTransactions.length,
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }
);

export default router;
