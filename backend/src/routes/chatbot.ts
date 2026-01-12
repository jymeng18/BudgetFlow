/**
 * Filename: chatbot.ts
 *
 * Desc: AI chatbot API routes
 *
 * Author: Jerry Meng
 */

import express, { Request, Response } from "express";
import { categories } from "../data/categories";
import { transactions } from "../data/transactions";
import { systemPrompt, formatFinancialData } from "../prompt/prompts";
import { getOpenAI } from "./utils";

const router = express.Router();

router.post("/api/generate", async (req: Request, res: Response) => {
  const { prompt, messages: conversationHistory } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: `${systemPrompt}${formatFinancialData(
          categories,
          transactions
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
});

export default router;
