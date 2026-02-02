/**
 * Filename: Index.tsx
 *
 * Desc: Main page with core functionality, where you manage your finances
 *
 * Author: Jerry Meng
 *
 * Last Modified: Jan 2026
 */

import { useState } from "react";
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
    useTransactions,
    useCategories,
    useBudgetSummary,
    useAddTransaction,
} from "@/hooks/useBudgetData";

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

    // React Query hooks with optimistic updates
    const { data: categoryGroups = [] } = useCategories(budgetType);
    const { data: transactions = [] } = useTransactions();
    const { data: summaryData } = useBudgetSummary(budgetType);
    const addTransactionMutation = useAddTransaction(budgetType);

    // Convert summary data to the format expected by BudgetSummary component
    const summaryItems = summaryData
        ? [
              {
                  label: "Income",
                  amount: summaryData.totalIncome,
                  type: "income" as const,
              },
              {
                  label: "Budgeted",
                  amount: summaryData.totalBudgeted,
                  type: "expense" as const,
              },
              {
                  label: "Available",
                  amount: summaryData.totalAvailable,
                  type: "available" as const,
              },
          ]
        : [];

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

    // Handle saving a new transaction with optimistic update
    const handleSaveTransaction = (transaction: TransactionData) => {
        addTransactionMutation.mutate(transaction);
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
            />
            <RecentTransactions
              transactions={transactions}
              categoryGroups={categoryGroups}
              budgetType={budgetType}
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
