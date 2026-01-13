import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Transaction, type CategoryGroup } from "@/lib/api";
import { useDeleteTransaction } from "@/hooks/useBudgetData";
import { type BudgetType } from "@/components/budget/BudgetTypeTabs";

interface RecentTransactionsProps {
    transactions: Transaction[];
    categoryGroups: CategoryGroup[];
    budgetType: BudgetType;
}

export function RecentTransactions({
    transactions,
    categoryGroups,
    budgetType,
}: RecentTransactionsProps) {
    const deleteTransactionMutation = useDeleteTransaction(budgetType);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
    };

    // Format date to display like "Dec 17"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Get category name from ID
    const getCategoryName = (categoryId: string | null): string => {
        if (!categoryId) return "Uncategorized";
        for (const group of categoryGroups) {
            const category = group.categories.find((cat) => cat.id === categoryId);
            if (category) return category.name;
        }
        return "Uncategorized";
    };

    // Handle deleting a transaction with optimistic update
    const handleDelete = (id: string) => {
        deleteTransactionMutation.mutate(id);
    };

    return (
        <div className="bg-card border-l border-border w-80 flex flex-col">
            <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-sm">Recent Transactions</h2>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin">
                {transactions.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                        No transactions yet
                    </div>
                ) : (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors group"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        transaction.type === "income"
                                            ? "bg-success/10 text-success"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {transaction.type === "income" ? (
                                        <ArrowDownLeft className="w-4 h-4" />
                                    ) : (
                                        <ArrowUpRight className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium truncate">
                                            {transaction.payee}
                                        </span>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span
                                                className={cn(
                                                    "text-sm font-medium truncate",
                                                    transaction.type ===
                                                        "income"
                                                        ? "text-success"
                                                        : "text-foreground"
                                                )}
                                                title={`${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`}
                                            >
                                                {transaction.type === "income"
                                                    ? "+"
                                                    : "-"}
                                                {formatCurrency(
                                                    transaction.amount
                                                )}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleDelete(transaction.id)
                                                }
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                                            >
                                                <Trash2 className="w-3 h-3 text-destructive" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <span className="text-xs text-muted-foreground truncate">
                                            {getCategoryName(transaction.categoryId)}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">
                                            {formatDate(transaction.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="px-4 py-3 border-t border-border">
                <button className="text-sm text-primary hover:underline font-medium">
                    View All Transactions
                </button>
            </div>
        </div>
    );
}
