/**
 * Filename: api.ts
 *
 * Desc: Communicate and fetch data from backend Express.js server
 *
 * Author: Jerry Meng
 *
 * Last modified: Dec 2025
 */

const API_BASE_URL = "http://localhost:8000/api";

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

export async function getCategories(
    budgetType: string
): Promise<CategoryGroup[]> {
    const response = await fetch(`${API_BASE_URL}/categories/${budgetType}`);

    if (!response.ok) {
        throw new Error("Failed to fetch categories data.");
    }
    return response.json();
}

export async function getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions data.");
    }
    return response.json();
}

export async function addTransaction(transaction: {
    // Backennd will send back id
    date: string;
    payee: string;
    categoryId: string;
    amount: number;
    notes: string;
    type: "expense" | "income";
    budgetType: string;
}): Promise<{ message: string; transaction: Transaction }> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        throw new Error("Failed to add new transaction.");
    }
    return response.json();
}

export async function deleteTransaction(
    id: string
): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete a transaction.");
    }
    return response.json();
}

export async function updateCategoryBudget(
    budgetType: string,
    categoryId: string,
    budgeted: number
): Promise<{ message: string; category: Category }> {
    const response = await fetch(
        `${API_BASE_URL}/categories/${budgetType}/${categoryId}/budget`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ budgeted }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update budget");
    }

    return response.json();
}

export async function getBudgetSummary(
    budgetType: string
): Promise<BudgetSummary> {
    const response = await fetch(`${API_BASE_URL}/summary/${budgetType}`);

    if (!response.ok) {
        throw new Error("Failed to fetch summary");
    }

    return response.json();
}

export interface AnalyticsData {
    budgetType: string;
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    targetsCompleted: number;
    criticalTargets: string[];
    top3Expenses: { name: string; spent: number }[];
    top3Remaining: { name: string; available: number }[];
    mostFrequentCategory: string;
    percentageNotSpent: number;
    averageTransactionAmount: number;
    totalTransactions: number;
    expenseTransactions: number;
}

export async function getAnalytics(budgetType: string): Promise<AnalyticsData> {
    const response = await fetch(`${API_BASE_URL}/analytics/${budgetType}`);

    if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
    }

    return response.json();
}

export interface ChatResponse {
    response: string;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export async function sendChatMessage(
    prompt: string,
    conversationHistory?: ChatMessage[]
): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            prompt,
            messages: conversationHistory || []
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to get AI response");
    }

    return response.json();
}

/* Authentication API Functions */

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
    };
    session: {
        access_token: string;
        refresh_token: string;
    } | null;
}

export async function signUp(
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
    }

    return response.json();
}

export async function login(
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
    }

    return response.json();
}

export async function signOut(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signOut`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign out");
    }

    return response.json();
}
