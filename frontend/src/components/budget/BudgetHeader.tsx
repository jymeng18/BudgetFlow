import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetHeaderProps {
    month: string;
    year: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onAddTransaction?: () => void;
}

export function BudgetHeader({
    month,
    year,
    onPrevMonth,
    onNextMonth,
    onAddTransaction,
}: BudgetHeaderProps) {
    return (
        <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onPrevMonth}
                            className="p-1.5 rounded-md hover:bg-accent transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button
                            onClick={onNextMonth}
                            className="p-1.5 rounded-md hover:bg-accent transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                    <h1 className="text-xl font-semibold">
                        {month} {year}
                    </h1>
                </div>

                <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={onAddTransaction}
                >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </Button>
            </div>
        </header>
    );
}
