/**
 * Filename: utils.ts
 *
 * Desc: Shared utilities and helpers for route handlers
 *
 * Author: Jerry Meng
 */

import { BudgetType } from "../types/interfaces";
import OpenAI from "openai";

// Lazy initialization to ensure env vars are loaded
let openai: OpenAI;
export function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return openai;
}

export function isValidBudgetType(type: string): type is BudgetType {
  return type === "personal" || type === "shared" || type === "family";
}
