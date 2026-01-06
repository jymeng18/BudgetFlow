/**
 * Filename: routes.ts
 * 
 * Desc: Routing/Services for Backend Server
 * 
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express"
import {
  BudgetType,
  Category,
  Transaction,
  CategoriesData,
} from "../types/interfaces";
import { categories } from "../data/categories";
import { transactions } from "../data/transactions";

const router = express.Router();

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

  if(!isValidBudgetType(budgetType)){
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

  for(let group of budgetData){
    for(let cat of group.categories){
      totalAvailable += cat.available;
      totalBudgeted += cat.budgeted;
      totalSpent += cat.spent;
    }
  }

  for(let t of transactions){
    if(t.type === "income"){
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

export default router;
