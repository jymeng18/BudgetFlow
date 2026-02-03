/**
 * Filename: categories.ts
 *
 * Desc: Category-related API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { supabase } from "../server";
import { authenticateUser } from "../middleware/authMiddleware";
import { isValidBudgetType } from "./utils";

const router = express.Router();

router.get(
  "/api/categories/:budgetType",
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
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .eq("budget_type", budgetType);
      
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Transform flat data into grouped format for frontend
      const grouped = data.reduce((acc: any[], cat) => {
        let group = acc.find((g) => g.id === cat.group_id);
        if (!group) {
          group = { id: cat.group_id, name: cat.group_name, categories: [] };
          acc.push(group);
        }
        group.categories.push({
          id: cat.id,
          name: cat.name,
          budgeted: parseFloat(cat.budgeted),
          spent: parseFloat(cat.spent),
          available: parseFloat(cat.available),
        });
        return acc;
      }, []);

      res.json(grouped);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }
);

router.put(
  "/api/categories/:budgetType/:categoryId/budget",
  authenticateUser,
  async (req: Request, res: Response) => {
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

    try {
      // First get current spent to calculate available
      const { data: current, error: fetchError } = await supabase
        .from("categories")
        .select("spent")
        .eq("id", categoryId)
        .single();

      if (fetchError || !current) {
        res.status(404).json({ error: "Category not found." });
        return;
      }

      const available = budgeted - parseFloat(current.spent);

      const { data, error } = await supabase
        .from("categories")
        .update({ budgeted, available })
        .eq("id", categoryId)
        .select()
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({
        message: "Updated budget successfully.",
        category: {
          id: data.id,
          name: data.name,
          budgeted: parseFloat(data.budgeted),
          spent: parseFloat(data.spent),
          available: parseFloat(data.available),
        },
      });
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  }
);

router.delete(
  "/api/categories/:budgetType/:categoryId",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { budgetType, categoryId } = req.params;
    const userId = req.userId;

    if (!isValidBudgetType(budgetType)) {
      res.status(400).json({
        error: "Invalid budget type.",
      });
      return;
    }

    try {
      // First verify the category belongs to the user
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .eq("user_id", userId)
        .single();

      if (categoryError || !category) {
        res.status(404).json({ error: "Category not found." });
        return;
      }

      // Get all transactions for this category to calculate balance adjustment
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("category_id", categoryId)
        .eq("user_id", userId);

      if (transactionsError) {
        res.status(500).json({ error: transactionsError.message });
        return;
      }

      let balanceAdjustment = 0;
      if (transactions && transactions.length > 0) {
        balanceAdjustment = transactions.reduce((total, txn) => {
          return total + (txn.type === "expense" ? parseFloat(txn.amount) : -parseFloat(txn.amount));
        }, 0);
      }

      // Delete all transactions associated with this category
      const { error: deleteTransactionsError } = await supabase
        .from("transactions")
        .delete()
        .eq("category_id", categoryId)
        .eq("user_id", userId);

      if (deleteTransactionsError) {
        res.status(500).json({ error: deleteTransactionsError.message });
        return;
      }

      // Delete the category
      const { error: deleteCategoryError } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", userId);

      if (deleteCategoryError) {
        res.status(500).json({ error: deleteCategoryError.message });
        return;
      }

      res.status(200).json({
        message: "Category and associated transactions deleted successfully.",
        deletedTransactionsCount: transactions?.length || 0,
        balanceAdjustment,
        category: {
          id: category.id,
          name: category.name,
          budgeted: parseFloat(category.budgeted),
          spent: parseFloat(category.spent),
        },
      });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
);

export default router;
