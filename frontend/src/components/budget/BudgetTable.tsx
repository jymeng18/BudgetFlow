import { useState } from "react";
import { CategoryGroup, type Category } from "./CategoryGroup";
import { type BudgetType } from "./BudgetTypeTabs";
import { TargetModal, type TargetData } from "./TargetModal";
import { useUpdateCategoryBudget } from "@/hooks/useBudgetData";

// Type for category group data from the backend
interface CategoryGroupData {
    id: string;
    name: string;
    categories: Category[];
}

interface BudgetTableProps {
    budgetType: BudgetType;
    categoryGroups: CategoryGroupData[];
}

export function BudgetTable({
    budgetType,
    categoryGroups,
}: BudgetTableProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const updateBudgetMutation = useUpdateCategoryBudget(budgetType);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setIsTargetModalOpen(true);
    };

    // Save budget target with optimistic update
    const handleSaveTarget = (categoryId: string, target: TargetData) => {
        updateBudgetMutation.mutate({ categoryId, budgeted: target.amount });
    };

    const handleDeleteTarget = (categoryId: string) => {
        updateBudgetMutation.mutate({ categoryId, budgeted: 0 });
    };

    return (
        <div className="flex-1 overflow-auto">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr,120px,120px,120px] gap-4 px-4 py-2 bg-muted border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Category</span>
                <span className="text-right">Budgeted</span>
                <span className="text-right">Spent</span>
                <span className="text-right">Available</span>
            </div>

            {/* Category Groups */}
            <div>
                {categoryGroups.map((group) => (
                    <CategoryGroup
                        key={group.id}
                        name={group.name}
                        categories={group.categories}
                        onCategoryClick={handleCategoryClick}
                    />
                ))}
            </div>

            {/* Target Modal */}
            <TargetModal
                category={selectedCategory}
                open={isTargetModalOpen}
                onOpenChange={setIsTargetModalOpen}
                onSave={handleSaveTarget}
                onDelete={handleDeleteTarget}
            />
        </div>
    );
}
