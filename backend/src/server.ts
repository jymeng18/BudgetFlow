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
type CategoriesData = Record<BudgetType, CategoryGroup[]>;

// In memory storage temporarily - move to db later 
const categories: CategoriesData = {
  personal: [
    {
      id: "1",
      name: "Fixed Expenses",
      categories: [
        {
          id: "1-1",
          name: "Rent/Mortgage",
          budgeted: 1500,
          spent: 1500,
          available: 0,
        },
        {
          id: "1-2",
          name: "Utilities",
          budgeted: 200,
          spent: 175.5,
          available: 24.5,
        },
        {
          id: "1-3",
          name: "Insurance",
          budgeted: 300,
          spent: 300,
          available: 0,
        },
        {
          id: "1-4",
          name: "Internet",
          budgeted: 80,
          spent: 79.99,
          available: 0.01,
        },
      ],
    },
    {
      id: "2",
      name: "Variable Expenses",
      categories: [
        {
          id: "2-1",
          name: "Groceries",
          budgeted: 600,
          spent: 485.23,
          available: 114.77,
        },
        {
          id: "2-2",
          name: "Gas/Transportation",
          budgeted: 250,
          spent: 180.0,
          available: 70.0,
        },
        {
          id: "2-3",
          name: "Dining Out",
          budgeted: 200,
          spent: 245.5,
          available: -45.5,
        },
        {
          id: "2-4",
          name: "Entertainment",
          budgeted: 150,
          spent: 89.99,
          available: 60.01,
        },
      ],
    },
    {
      id: "3",
      name: "Savings Goals",
      categories: [
        {
          id: "3-1",
          name: "Emergency Fund",
          budgeted: 500,
          spent: 500,
          available: 0,
        },
        {
          id: "3-2",
          name: "Vacation",
          budgeted: 200,
          spent: 200,
          available: 0,
        },
        { id: "3-3", name: "New Car", budgeted: 300, spent: 300, available: 0 },
      ],
    },
    {
      id: "4",
      name: "Personal",
      categories: [
        {
          id: "4-1",
          name: "Clothing",
          budgeted: 100,
          spent: 45.0,
          available: 55.0,
        },
        {
          id: "4-2",
          name: "Health & Fitness",
          budgeted: 80,
          spent: 50.0,
          available: 30.0,
        },
        {
          id: "4-3",
          name: "Subscriptions",
          budgeted: 50,
          spent: 42.97,
          available: 7.03,
        },
      ],
    },
  ],
  shared: [
    {
      id: "s1",
      name: "Shared Living Expenses",
      categories: [
        {
          id: "s1-1",
          name: "Rent Split",
          budgeted: 750,
          spent: 750,
          available: 0,
        },
        {
          id: "s1-2",
          name: "Utilities Split",
          budgeted: 100,
          spent: 87.75,
          available: 12.25,
        },
        {
          id: "s1-3",
          name: "Internet Split",
          budgeted: 40,
          spent: 40,
          available: 0,
        },
      ],
    },
    {
      id: "s2",
      name: "Roommate Balances",
      categories: [
        {
          id: "s2-1",
          name: "Alex owes you",
          budgeted: 0,
          spent: -125.0,
          available: 125.0,
        },
        {
          id: "s2-2",
          name: "You owe Jordan",
          budgeted: 0,
          spent: 45.5,
          available: -45.5,
        },
      ],
    },
    {
      id: "s3",
      name: "Shared Groceries",
      categories: [
        {
          id: "s3-1",
          name: "Household Items",
          budgeted: 75,
          spent: 62.3,
          available: 12.7,
        },
        {
          id: "s3-2",
          name: "Shared Food",
          budgeted: 150,
          spent: 134.0,
          available: 16.0,
        },
      ],
    },
  ],
  family: [
    {
      id: "f1",
      name: "Household",
      categories: [
        {
          id: "f1-1",
          name: "Mortgage",
          budgeted: 2200,
          spent: 2200,
          available: 0,
        },
        {
          id: "f1-2",
          name: "Property Tax",
          budgeted: 350,
          spent: 350,
          available: 0,
        },
        {
          id: "f1-3",
          name: "Home Insurance",
          budgeted: 150,
          spent: 150,
          available: 0,
        },
        {
          id: "f1-4",
          name: "Home Maintenance",
          budgeted: 200,
          spent: 125.0,
          available: 75.0,
        },
      ],
    },
    {
      id: "f2",
      name: "Family Expenses",
      categories: [
        {
          id: "f2-1",
          name: "Groceries",
          budgeted: 800,
          spent: 720.5,
          available: 79.5,
        },
        {
          id: "f2-2",
          name: "Family Activities",
          budgeted: 200,
          spent: 145.0,
          available: 55.0,
        },
        {
          id: "f2-3",
          name: "Kids Education",
          budgeted: 400,
          spent: 400,
          available: 0,
        },
      ],
    },
    {
      id: "f3",
      name: "Family Savings",
      categories: [
        {
          id: "f3-1",
          name: "College Fund",
          budgeted: 500,
          spent: 500,
          available: 0,
        },
        {
          id: "f3-2",
          name: "Family Vacation",
          budgeted: 300,
          spent: 300,
          available: 0,
        },
        {
          id: "f3-3",
          name: "Emergency Fund",
          budgeted: 400,
          spent: 400,
          available: 0,
        },
      ],
    },
  ],
};

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2024-12-17",
    payee: "Whole Foods Market",
    categoryId: "2-1",
    amount: 85.23,
    type: "expense",
    notes: "",
  },
  {
    id: "2",
    date: "2024-12-16",
    payee: "Shell Gas Station",
    categoryId: "2-2",
    amount: 45.0,
    type: "expense",
    notes: "",
  },
  {
    id: "3",
    date: "2024-12-15",
    payee: "Paycheck",
    categoryId: "income",
    amount: 2500.0,
    type: "income",
    notes: "Monthly salary",
  },
  {
    id: "4",
    date: "2024-12-15",
    payee: "Netflix",
    categoryId: "4-3",
    amount: 15.99,
    type: "expense",
    notes: "",
  },
  {
    id: "5",
    date: "2024-12-14",
    payee: "Chipotle",
    categoryId: "2-3",
    amount: 12.5,
    type: "expense",
    notes: "",
  },
  {
    id: "6",
    date: "2024-12-13",
    payee: "Amazon",
    categoryId: "4-1",
    amount: 34.99,
    type: "expense",
    notes: "",
  },
  {
    id: "7",
    date: "2024-12-12",
    payee: "Transfer to Savings",
    categoryId: "3-1",
    amount: 500.0,
    type: "expense",
    notes: "",
  },
];








function isValidBudgetType(type: string): type is BudgetType {
  return type === "personal" || type === "shared" || type === "family";
}


function findAndUpdateCategory(
  budgetType: BudgetType, 
  categoryId: string,
  updateFn: (category: Category) => void 
): Category | null {
  const budgetData = categories[budgetType];
  
  for(const group of budgetData){
    for(const category of group.categories){
      if(category.id === categoryId){
        updateFn(category);
        return category;
      }
    }
  }
  return null;
}






const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json());

// Remove later
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: "healthy", message: "we goood gng"});
});

app.get('/api/categories/:budgetType', (req: Request, res: Response) => {
  const { budgetType } = req.params;

  if(!isValidBudgetType(budgetType)){
    res.status(400).json({
      error: "Invalid budget type."
    });
    return;
  }

  res.json();
  
})

app.get('/api/transactions', (req: Request, res: Response) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
})

let transactionIdCounter: number = 8; // start at 8 since we have some dummy data already 

// User adds a new transaction
app.post('/api/transactions', (req: Request, res: Response) => {
  const { date, payee, categoryId, amount, notes, type, budgetType } = req.body;

  if(!date || !payee || !amount || !type){
    res.status(400).json({
      error: "Missing required fields."
    });
    return;
  }

  if(type !== "expense" || type !== "income"){
    res.status(400).json({
      error: "Invalid Type: Must be 'expense' or 'income'."
    });
    return;
  }

  if(typeof amount !== "number" || amount <= 0){
    res.status(400).json({
      error: "Amount must be a non-negative number."
    });
    return;
  }

  // Create new transaction
  const newTransaction: Transaction = {
    id: String(transactionIdCounter++),
    date,
    payee,
    categoryId: categoryId || "uncategorized",
    amount, 
    type,
    notes: notes || "",
  };

  transactions.push(newTransaction);

  if(categoryId && type === "expense" && budgetType && isValidBudgetType(budgetType)){
    findAndUpdateCategory(budgetType, categoryId, (category) => {
      category.spent += amount;
      category.available = category.budgeted - category.spent;
    });
  }

  // Add for 'income'





})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});