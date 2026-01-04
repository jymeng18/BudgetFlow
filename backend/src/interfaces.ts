// 'Groceries' or 'Utilities'
export interface Category {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  available: number;
}

// 'Fixed Expenses' or 'Variable Expenses'
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
  type: "income" | "expense";
  notes: string;
}

export type BudgetType = "personal" | "shared" | "family";
export type CategoriesData = Record<BudgetType, CategoryGroup[]>;