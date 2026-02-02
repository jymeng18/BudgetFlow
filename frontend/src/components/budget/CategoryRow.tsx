import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { Category } from "./CategoryGroup";

interface CategoryRowProps {
    category: Category;
    onClick?: (category: Category) => void;
}

export function CategoryRow({ category, onClick }: CategoryRowProps) {
    const { name, budgeted, spent, available } = category;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
    };

    const spentPercentage =
        budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;
    const isOverBudget = spent > budgeted;

    return (
        <div
            onClick={() => onClick?.(category)}
            className={cn(
                "grid grid-cols-[1fr,120px,120px,120px] gap-4 px-4 py-3 transition-colors group",
                onClick && "cursor-pointer hover:bg-accent/50"
            )}
        >
            <div className="flex items-center gap-3 pl-6">
                <div className="flex-1">
                    <span className="text-sm">{name}</span>
                    <div className="mt-1.5 w-2/3">
                        <Progress
                            value={spentPercentage}
                            className={cn(
                                "h-1.5",
                                isOverBudget && "[&>div]:bg-destructive"
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end min-w-0">
                <span className="text-sm text-muted-foreground truncate" title={formatCurrency(budgeted)}>
                    {formatCurrency(budgeted)}
                </span>
            </div>
            <div className="flex items-center justify-end min-w-0">
                <span className="text-sm text-muted-foreground truncate" title={formatCurrency(spent)}>
                    {formatCurrency(spent)}
                </span>
            </div>
            <div className="flex items-center justify-end min-w-0">
                <span
                    className={cn(
                        "text-sm font-medium px-2 py-0.5 rounded truncate",
                        available >= 0
                            ? "text-success bg-success/10"
                            : "text-destructive bg-destructive/10"
                    )}
                    title={`${available < 0 ? "-" : ""}${formatCurrency(available)}`}
                >
                    {available < 0 && "-"}
                    {formatCurrency(available)}
                </span>
            </div>
        </div>
    );
}
