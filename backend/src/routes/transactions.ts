/**
 * Filename: transactions.ts
 *
 * Desc: Transaction-related API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { Transaction } from "../types/interfaces";
import { transactions } from "../data/transactions";
import { isValidBudgetType, findAndUpdateCategory } from "./utils";

const router = express.Router();

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

export default router;
