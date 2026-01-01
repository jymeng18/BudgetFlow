import { cn } from "@/lib/utils";
import { User, Users, Home } from "lucide-react";

export type BudgetType = "personal" | "shared" | "family";

interface BudgetTypeTabsProps {
    activeType: BudgetType;
    onTypeChange: (type: BudgetType) => void;
}

const budgetTypes = [
    { id: "personal" as const, label: "Personal", icon: User },
    { id: "shared" as const, label: "Shared", icon: Users },
    { id: "family" as const, label: "Family", icon: Home },
];

export function BudgetTypeTabs({
    activeType,
    onTypeChange,
}: BudgetTypeTabsProps) {
    return (
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {budgetTypes.map((type) => (
                <button
                    key={type.id}
                    onClick={() => onTypeChange(type.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                        activeType === type.id
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                </button>
            ))}
        </div>
    );
}
