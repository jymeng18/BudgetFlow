/**
 * Filename: transactions.ts
 *
 * Desc: Transaction-related API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { supabase } from "../server";
import { authenticateUser } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get(
  "/api/transactions",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Transform to match frontend interface
      const transactions = data.map((t) => ({
        id: t.id,
        date: t.date,
        payee: t.payee,
        categoryId: t.category_id,
        amount: parseFloat(t.amount),
        type: t.type,
        notes: t.notes || "",
      }));

      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }
);

router.post(
  "/api/transactions",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { date, payee, categoryId, amount, notes, type } = req.body;

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

    try {
      const newTransaction = {
        id: uuidv4(),
        user_id: userId,
        date,
        payee,
        category_id: categoryId || null,
        amount,
        type,
        notes: notes || "",
      };

      const { data, error } = await supabase
        .from("transactions")
        .insert(newTransaction)
        .select()
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Update category spent/available based on transaction type
      if (categoryId) {
        const { data: cat } = await supabase
          .from("categories")
          .select("spent, budgeted, available")
          .eq("id", categoryId)
          .single();

        if (cat) {
          if (type === "expense") {
            const newSpent = parseFloat(cat.spent) + amount;
            await supabase
              .from("categories")
              .update({
                spent: newSpent,
                available: parseFloat(cat.budgeted) - newSpent,
              })
              .eq("id", categoryId);
          } else if (type === "income") {
            // Income adds to the category's available amount
            const newAvailable = parseFloat(cat.available) + amount;
            await supabase
              .from("categories")
              .update({
                available: newAvailable,
              })
              .eq("id", categoryId);
          }
        }
      }

      res.status(201).json({
        message: "Transaction added successfully",
        transaction: {
          id: data.id,
          date: data.date,
          payee: data.payee,
          categoryId: data.category_id,
          amount: parseFloat(data.amount),
          type: data.type,
          notes: data.notes || "",
        },
      });
    } catch (error) {
      console.error("Add transaction error:", error);
      res.status(500).json({ error: "Failed to add transaction" });
    }
  }
);

router.delete(
  "/api/transactions/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Get transaction first to update category
      const { data: transaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !transaction) {
        res.status(404).json({ error: "Transaction not found." });
        return;
      }

      // Reverse the category update based on transaction type
      if (transaction.category_id) {
        const { data: cat } = await supabase
          .from("categories")
          .select("spent, budgeted, available")
          .eq("id", transaction.category_id)
          .single();

        if (cat) {
          if (transaction.type === "expense") {
            const newSpent = parseFloat(cat.spent) - parseFloat(transaction.amount);
            await supabase
              .from("categories")
              .update({
                spent: newSpent,
                available: parseFloat(cat.budgeted) - newSpent,
              })
              .eq("id", transaction.category_id);
          } else if (transaction.type === "income") {
            // Reverse income: subtract from available
            const newAvailable = parseFloat(cat.available) - parseFloat(transaction.amount);
            await supabase
              .from("categories")
              .update({
                available: newAvailable,
              })
              .eq("id", transaction.category_id);
          }
        }
      }

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({
        message: "Transaction successfully deleted",
        transaction: {
          id: transaction.id,
          date: transaction.date,
          payee: transaction.payee,
          categoryId: transaction.category_id,
          amount: parseFloat(transaction.amount),
          type: transaction.type,
          notes: transaction.notes || "",
        },
      });
    } catch (error) {
      console.error("Delete transaction error:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  }
);

export default router;
