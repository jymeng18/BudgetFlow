import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (transaction: TransactionData) => void;
    categories: { id: string; name: string; groupName: string }[];
}

export interface TransactionData {
    date: string;
    payee: string;
    categoryId: string;
    amount: number;
    notes: string;
    type: "expense" | "income";
}

export function AddTransactionModal({
    open,
    onOpenChange,
    onSave,
    categories,
}: AddTransactionModalProps) {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [payee, setPayee] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [type, setType] = useState<"expense" | "income">("expense");

    const handleSave = () => {
        onSave({
            date,
            payee,
            categoryId,
            amount: parseFloat(amount) || 0,
            notes,
            type,
        });
        handleClose();
    };

    const handleClose = () => {
        setDate(new Date().toISOString().split("T")[0]);
        setPayee("");
        setCategoryId("");
        setAmount("");
        setNotes("");
        setType("expense");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Transaction Type */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={type === "expense" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setType("expense")}
                        >
                            Expense
                        </Button>
                        <Button
                            type="button"
                            variant={type === "income" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setType("income")}
                        >
                            Income
                        </Button>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Payee */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Payee / Description
                        </label>
                        <Input
                            placeholder="e.g., Grocery Store"
                            value={payee}
                            onChange={(e) => setPayee(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.groupName} → {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
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

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Notes (optional)
                        </label>
                        <Textarea
                            placeholder="Add any notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!payee || !amount}>
                        Add Transaction
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
