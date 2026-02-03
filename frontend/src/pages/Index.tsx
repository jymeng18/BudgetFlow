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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
    const [budgetType, setBudgetType] = useState<BudgetType>("personal");
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [highlightedCategoryId, setHighlightedCategoryId] = useState<string | null>(null);

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

    const handleAddTransaction = () => {
        setIsTransactionModalOpen(true);
    };

    // Handle saving a new transaction with optimistic update
    const handleSaveTransaction = (transaction: TransactionData) => {
        addTransactionMutation.mutate(transaction);
        
        // Highlight the affected category
        if (transaction.categoryId) {
            setHighlightedCategoryId(transaction.categoryId);
            // Remove highlight after animation completes
            setTimeout(() => setHighlightedCategoryId(null), 2000);
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

      >
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 ml-64">
          <div className="px-6 py-3 border-b border-border bg-card flex items-center justify-between">
            <BudgetTypeTabs
              activeType={budgetType}
              onTypeChange={setBudgetType}
            />
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleAddTransaction}
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>

          <BudgetSummary items={summaryItems} />

          <div className="flex-1 flex min-h-0">
            <BudgetTable
              budgetType={budgetType}
              categoryGroups={categoryGroups}
              highlightedCategoryId={highlightedCategoryId}
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
