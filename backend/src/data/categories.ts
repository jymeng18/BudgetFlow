import { CategoriesData } from "../types/interfaces";

// In memory storage temporarily - move to db later
export const categories: CategoriesData = {
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
