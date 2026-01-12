/**
 * Filename: utils.ts
 *
 * Desc: Shared utilities and helpers for route handlers
 *
 * Author: Jerry Meng
 */

import { BudgetType, Category } from "../types/interfaces";
import { categories } from "../data/categories";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Supabase client
// export const supabase = createClient(
//   process.env.SUPABASE_URL as string,
//   process.env.SUPABASE_SERVICE_ROLE_KEY as string
// );

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

export function findAndUpdateCategory(
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
