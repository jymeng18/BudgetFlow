import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CategoryRow } from "./CategoryRow";

export interface Category {
    id: string;
    name: string;
    budgeted: number;
    spent: number;
    available: number;
}

interface CategoryGroupProps {
    name: string;
    categories: Category[];
    onCategoryClick?: (category: Category) => void;
}

export function CategoryGroup({
    name,
    categories,
    onCategoryClick,
}: CategoryGroupProps) {
    const [isOpen, setIsOpen] = useState(true);

    const totalBudgeted = categories.reduce(
        (sum, cat) => sum + cat.budgeted,
        0
    );
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const totalAvailable = categories.reduce(
        (sum, cat) => sum + cat.available,
        0
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(Math.abs(amount));
    };

    return (
        <div className="border-b border-border">
            {/* Group Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full grid grid-cols-[1fr,120px,120px,120px] gap-4 px-4 py-3 bg-accent/50 hover:bg-accent transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            !isOpen && "-rotate-90"
                        )}
                    />
                    <span className="font-medium text-sm">{name}</span>
                </div>
                <span className="text-sm text-right text-muted-foreground">
                    {formatCurrency(totalBudgeted)}
                </span>
                <span className="text-sm text-right text-muted-foreground">
                    {formatCurrency(totalSpent)}
                </span>
                <span
                    className={cn(
                        "text-sm text-right font-medium",
                        totalAvailable >= 0
                            ? "text-success"
                            : "text-destructive"
                    )}
                >
                    {totalAvailable < 0 && "-"}
                    {formatCurrency(totalAvailable)}
                </span>
            </button>

            {/* Categories */}
            {isOpen && (
                <div className="animate-fade-in">
                    {categories.map((category) => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                            onClick={onCategoryClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
