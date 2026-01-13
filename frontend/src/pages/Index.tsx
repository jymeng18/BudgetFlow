/**
 * Filename: Index.tsx
 *
 * Desc: Main page with core functionality, where you manage your finances
 *
 * Author: Jerry Meng
 *
 * Last Modified: Dec 2025
 */

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BudgetHeader } from "@/components/budget/BudgetHeader";
import { BudgetSummary } from "@/components/budget/BudgetSummary";
import { BudgetTable } from "@/components/budget/BudgetTable";
import {
    BudgetTypeTabs,
    type BudgetType,
} from "@/components/budget/BudgetTypeTabs";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import {
    AddTransactionModal,
    type TransactionData,
} from "@/components/budget/AddTransactionModal";
import {
    getCategories,
    getTransactions,
    addTransaction,
    getBudgetSummary,
    type CategoryGroup,
    type Transaction,
} from "@/lib/api";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const Index = () => {
    const [currentMonth, setCurrentMonth] = useState(11);
    const [currentYear, setCurrentYear] = useState(2024);
    const [budgetType, setBudgetType] = useState<BudgetType>("personal");
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // State for data from the backend
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summaryItems, setSummaryItems] = useState<
        {
            label: string;
            amount: number;
            type: "income" | "expense" | "available";
        }[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from backend when component loads or budgetType changes
    useEffect(() => {
        fetchData();
    }, [budgetType]);

    // Function to fetch all data from the backend
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch categories, transactions, and summary in parallel
            // Note: all calls to backend must suceed
            const [categoriesData, transactionsData, summaryData] =
                await Promise.all([
                    getCategories(budgetType),
                    getTransactions(),
                    getBudgetSummary(budgetType),
                ]);

            setCategoryGroups(categoriesData);
            setTransactions(transactionsData);

            // Convert summary data to the format expected by BudgetSummary component
            setSummaryItems([
                {
                    label: "Income",
                    amount: summaryData.totalIncome,
                    type: "income",
                },
                {
                    label: "Budgeted",
                    amount: summaryData.totalBudgeted,
                    type: "expense",
                },
                {
                    label: "Available",
                    amount: summaryData.totalAvailable,
                    type: "available",
                },
            ]);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleAddTransaction = () => {
        setIsTransactionModalOpen(true);
    };

    // Handle saving a new transaction to the backend
    const handleSaveTransaction = async (transaction: TransactionData) => {
        try {
            await addTransaction({
                ...transaction,
                budgetType,
            });
            // Refresh data after adding transaction
            fetchData();
        } catch (error) {
            console.error("Failed to save transaction:", error);
        }
    };

    // Get flattened categories for the dropdown in AddTransactionModal
    const categories = categoryGroups.flatMap((group) =>
        group.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            groupName: group.name,
        }))
    );

    return (
      <div
        className="flex h-screen w-full bg-background"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 ml-64">
          <BudgetHeader
            month={months[currentMonth]}
            year={currentYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onAddTransaction={handleAddTransaction}
          />

          <div className="px-6 py-3 border-b border-border bg-card">
            <BudgetTypeTabs
              activeType={budgetType}
              onTypeChange={setBudgetType}
            />
          </div>

          <BudgetSummary items={summaryItems} />

          <div className="flex-1 flex min-h-0">
            <BudgetTable
              budgetType={budgetType}
              categoryGroups={categoryGroups}
              onDataChange={fetchData}
            />
            <RecentTransactions
              transactions={transactions}
              categoryGroups={categoryGroups}
              onTransactionDeleted={fetchData}
            />
          </div>
        </div>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          open={isTransactionModalOpen}
          onOpenChange={setIsTransactionModalOpen}
          onSave={handleSaveTransaction}
          categories={categories}
        />
      </div>
    );
};

export default Index;
