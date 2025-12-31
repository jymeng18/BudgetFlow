/**
 * Filename: api.ts
 * 
 * Desc: Communicate and fetch data from backend Express.js server
 * 
 * Author: Jerry Meng
 * 
 * Last modified: Dec 2025
 */

const API_BASE_URL = "https://localhost:8000/api";

export interface Category {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  available: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

export interface Transaction {
  id: string;
  date: string;
  payee: string;
  categoryId: string;
  amount: number;
  notes: string;
  type: "expense" | "income";
}

export interface BudgetSummary {
  budgetType: string;
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  totalAvailable: number;
}

/* Simple API Function Calls */

export async function getCategories(budgetType: string): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories/${budgetType}`);

    if(!response.ok){
        throw new Error("Failed to fetch categories data.");
    }

    return response.json();
}
