/**
 * Filename: chatbot.ts
 *
 * Desc: AI chatbot API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { supabase } from "../server";
import { authenticateUser } from "../middleware/authMiddleware";
import { systemPrompt, formatFinancialData } from "../prompt/prompts";
import { getOpenAI } from "./utils";

const router = express.Router();

// Rate limiter for AI chatbot - 25 requests per day per user
const chatbotLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.userId || req.ip || "anonymous",
  message: {
    error: "You have reached your daily limit of 25 AI requests. Please try again tomorrow.",
  },
});

router.post(
  "/api/generate",
  authenticateUser,
  chatbotLimiter,
  async (req: Request, res: Response) => {
    const { prompt, messages: conversationHistory } = req.body;
    const userId = req.userId;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    try {
      // Fetch user's categories
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId);

      if (catError) {
        res.status(500).json({ error: catError.message });
        return;
      }

      // Fetch user's transactions
      const { data: transactionsData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(50);

      if (txError) {
        res.status(500).json({ error: txError.message });
        return;
      }

      // Group categories by budget_type and group_name for better context
      const groupedCategories = categoriesData.reduce((acc: any, cat) => {
        if (!acc[cat.budget_type]) {
          acc[cat.budget_type] = {};
        }
        if (!acc[cat.budget_type][cat.group_name]) {
          acc[cat.budget_type][cat.group_name] = [];
        }
        acc[cat.budget_type][cat.group_name].push({
          name: cat.name,
          budgeted: parseFloat(cat.budgeted),
          spent: parseFloat(cat.spent),
          available: parseFloat(cat.available),
        });
        return acc;
      }, {});

      // Format transactions for context
      const formattedTransactions = transactionsData.map((t) => ({
        date: t.date,
        payee: t.payee,
        amount: parseFloat(t.amount),
        type: t.type,
        notes: t.notes,
      }));

      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        {
          role: "system",
          content: `${systemPrompt}${formatFinancialData(
            groupedCategories,
            formattedTransactions
          )}`,
        },
      ];

      // Add conversation history if provided
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages.push(...conversationHistory);
      }

      messages.push({ role: "user", content: prompt });

      const completion = await getOpenAI().chat.completions.create({
        messages,
        model: "deepseek-chat",
      });

      const responseText =
        completion.choices[0]?.message?.content || "No response generated.";
      res.status(200).json({ response: responseText });
    } catch (error) {
      console.error("DeepSeek API error:", error);
      res.status(500).json({ error: "AI generation failed." });
    }
  }
);

export default router;
