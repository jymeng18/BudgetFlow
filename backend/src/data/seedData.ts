/**
 * Filename: seedData.ts
 *
 * Desc: Generate default categories and transactions for new users
 *
 * Author: Jerry Meng
 *
 * Last Modified: Jan 2026
 */

import { v4 as uuidv4 } from "uuid";

interface CategorySeed {
  id: string;
  user_id: string;
  budget_type: string;
  group_id: string;
  group_name: string;
  name: string;
  budgeted: number;
  spent: number;
  available: number;
}

interface TransactionSeed {
  id: string;
  user_id: string;
  date: string;
  payee: string;
  category_id: string | null;
  amount: number;
  type: "income" | "expense";
  notes: string;
}

const categoryGroups = [
  {
    groupId: "fixed",
    groupName: "Fixed Expenses",
    categories: [
      { name: "Rent/Mortgage", budgeted: 1500, spent: 1500 },
      { name: "Utilities", budgeted: 200, spent: 175.5 },
      { name: "Insurance", budgeted: 300, spent: 300 },
      { name: "Internet", budgeted: 80, spent: 79.99 },
    ],
  },
  {
    groupId: "variable",
    groupName: "Variable Expenses",
    categories: [
      { name: "Groceries", budgeted: 600, spent: 485.23 },
      { name: "Gas/Transportation", budgeted: 250, spent: 180 },
      { name: "Dining Out", budgeted: 200, spent: 245.5 },
      { name: "Entertainment", budgeted: 150, spent: 89.99 },
    ],
  },
  {
    groupId: "savings",
    groupName: "Savings Goals",
    categories: [
      { name: "Emergency Fund", budgeted: 500, spent: 500 },
      { name: "Vacation", budgeted: 200, spent: 200 },
      { name: "New Car", budgeted: 300, spent: 300 },
    ],
  },
  {
    groupId: "personal",
    groupName: "Personal",
    categories: [
      { name: "Clothing", budgeted: 100, spent: 0 },
      { name: "Healthcare", budgeted: 150, spent: 45 },
      { name: "Subscriptions", budgeted: 50, spent: 15.99 },
    ],
  },
];

export function generateUserCategories(userId: string): CategorySeed[] {
  const budgetTypes = ["personal", "shared", "family"] as const;
  const dbCategories: CategorySeed[] = [];

  for (const budgetType of budgetTypes) {
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        dbCategories.push({
          id: uuidv4(),
          user_id: userId,
          budget_type: budgetType,
          group_id: group.groupId,
          group_name: group.groupName,
          name: cat.name,
          budgeted: cat.budgeted,
          spent: cat.spent,
          available: cat.budgeted - cat.spent,
        });
      }
    }
  }

  return dbCategories;
}

export function generateUserTransactions(
  userId: string,
  categories: CategorySeed[]
): TransactionSeed[] {
  // Find category IDs for personal budget type
  const findCategoryId = (name: string): string | null => {
    const cat = categories.find(
      (c) => c.name === name && c.budget_type === "personal"
    );
    return cat?.id || null;
  };

  const today = new Date();
  const formatDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  return [
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(0),
      payee: "Whole Foods Market",
      category_id: findCategoryId("Groceries"),
      amount: 85.23,
      type: "expense",
      notes: "",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(1),
      payee: "Shell Gas Station",
      category_id: findCategoryId("Gas/Transportation"),
      amount: 45.0,
      type: "expense",
      notes: "",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(2),
      payee: "Paycheck",
      category_id: null,
      amount: 2500.0,
      type: "income",
      notes: "Monthly salary",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(2),
      payee: "Netflix",
      category_id: findCategoryId("Subscriptions"),
      amount: 15.99,
      type: "expense",
      notes: "",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(3),
      payee: "Chipotle",
      category_id: findCategoryId("Dining Out"),
      amount: 12.5,
      type: "expense",
      notes: "",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(4),
      payee: "Amazon",
      category_id: findCategoryId("Clothing"),
      amount: 34.99,
      type: "expense",
      notes: "",
    },
    {
      id: uuidv4(),
      user_id: userId,
      date: formatDate(5),
      payee: "Transfer to Savings",
      category_id: findCategoryId("Emergency Fund"),
      amount: 500.0,
      type: "expense",
      notes: "",
    },
  ];
}
