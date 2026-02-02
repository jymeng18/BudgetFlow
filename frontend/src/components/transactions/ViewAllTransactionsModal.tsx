import { ArrowDownLeft, ArrowUpRight, Trash2, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Transaction, type CategoryGroup } from "@/lib/api";
import { useDeleteTransaction } from "@/hooks/useBudgetData";
import { type BudgetType } from "@/components/budget/BudgetTypeTabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ViewAllTransactionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactions: Transaction[];
    categoryGroups: CategoryGroup[];
    budgetType: BudgetType;
}

export function ViewAllTransactionsModal({
    open,
    onOpenChange,
    transactions,
    categoryGroups,
    budgetType,
}: ViewAllTransactionsModalProps) {
    const deleteTransactionMutation = useDeleteTransaction(budgetType);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getCategoryName = (categoryId: string | null): string => {
        if (!categoryId) return "Uncategorized";
        for (const group of categoryGroups) {
            const category = group.categories.find((cat) => cat.id === categoryId);
            if (category) return category.name;
        }
        return "Uncategorized";
    };

    const handleDelete = (id: string) => {
        deleteTransactionMutation.mutate(id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
                <DialogHeader className="px-6 py-4 border-b border-border">
                    <DialogTitle className="text-xl font-semibold">
                        All Transactions
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {transactions.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            No transactions yet
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                                transaction.type === "income"
                                                    ? "bg-success/10 text-success"
                                                    : "bg-destructive/10 text-destructive"
                                            )}
                                        >
                                            {transaction.type === "income" ? (
                                                <ArrowDownLeft className="w-5 h-5" />
                                            ) : (
                                                <ArrowUpRight className="w-5 h-5" />
                                            )}
                                        </div>

                                        {/* Transaction Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-base mb-1">
                                                        {transaction.payee}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Tag className="w-3.5 h-3.5" />
                                                            <span>{getCategoryName(transaction.categoryId)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>{formatDate(transaction.date)}</span>
                                                        </div>
                                                    </div>
                                                    {transaction.notes && (
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            {transaction.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Amount and Delete Button */}
                                                <div className="flex items-start gap-3 flex-shrink-0">
                                                    <span
                                                        className={cn(
                                                            "text-lg font-semibold",
                                                            transaction.type === "income"
                                                                ? "text-success"
                                                                : "text-destructive"
                                                        )}
                                                    >
                                                        {transaction.type === "income" ? "+" : "-"}
                                                        {formatCurrency(transaction.amount)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/20 rounded"
                                                        title="Delete transaction"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border bg-muted/30">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Total Transactions
                        </span>
                        <span className="font-semibold">
                            {transactions.length}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
