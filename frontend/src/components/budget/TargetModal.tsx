import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "./CategoryGroup";

interface TargetModalProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (categoryId: string, target: TargetData) => void;
    onDelete: (categoryId: string) => void;
}

export interface TargetData {
    amount: number;
}

export function TargetModal({
    category,
    open,
    onOpenChange,
    onSave,
    onDelete,
}: TargetModalProps) {
    const [amount, setAmount] = useState("");

    const handleSave = () => {
        if (!category) return;
        onSave(category.id, {
            amount: parseFloat(amount) || 0,
        });
        handleClose();
    };

    const handleDelete = () => {
        if (!category) return;
        onDelete(category.id);
        handleClose();
    };

    const handleClose = () => {
        setAmount("");
        onOpenChange(false);
    };

    const handleClear = () => {
        setAmount("");
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-lg font-semibold">
                            {category.name}
                        </DialogTitle>
                        <button className="p-1 hover:bg-accent rounded transition-colors">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Budget Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-7"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        Clear
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
