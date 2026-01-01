import { cn } from "@/lib/utils";

interface SummaryItem {
    label: string;
    amount: number;
    type: "income" | "expense" | "available";
}

interface BudgetSummaryProps {
    items: SummaryItem[];
}

export function BudgetSummary({ items }: BudgetSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
    };

    return (
        <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center gap-8">
                {items.map((item, index) => (
                    <div key={item.label} className="flex items-center gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {item.label}
                            </p>
                            <p
                                className={cn(
                                    "text-xl font-semibold mt-0.5",
                                    item.type === "income" && "text-success",
                                    item.type === "expense" &&
                                        "text-foreground",
                                    item.type === "available" &&
                                        item.amount >= 0
                                        ? "text-success"
                                        : "text-destructive"
                                )}
                            >
                                {item.amount < 0 && "-"}
                                {formatCurrency(item.amount)}
                            </p>
                        </div>
                        {index < items.length - 1 && (
                            <div className="h-10 w-px bg-border" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
