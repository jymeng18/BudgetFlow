/**
 * Filename: server.ts
 * 
 * Desc: Backend API for webapp
 * 
 * Author: Jerry Meng
 * 
 * Last modified: Dec 2025
 */

import express, { Request, Response } from 'express';
import cors from 'cors';

// 'Groceries' or 'Utilities'
interface Category {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  available: number;
}

// 'Fixed Expenses' or 'Variable Expenses'
interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

interface Transaction {
  id: string;
  date: string;
  payee: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  notes: string;
}

type BudgetType = "personal" | "shared" | "family";

function isValidBudgetType(type: string): type is BudgetType {
  return type === "personal" || type === "shared" || type === "family";
}



const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng"});
});

app.get('/api/categories/:budgetType', (req: Request, res: Response) => {
  const { budgetType } = req.params;

  
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});