import {
    Wallet,
    PiggyBank,
    TrendingUp,
    Settings,
    Plus,
    ChevronDown,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Account {
    id: string;
    name: string;
    balance: number;
    type: "checking" | "savings" | "credit";
}

// Dummy data
const accounts: Account[] = [
    { id: "1", name: "Checking", balance: 3450.25, type: "checking" },
    { id: "2", name: "Savings", balance: 12500.0, type: "savings" },
    { id: "3", name: "Credit Card", balance: -1250.5, type: "credit" },
];

const navItems = [
    { icon: PiggyBank, label: "Budget", path: "/app" },
    { icon: TrendingUp, label: "Reports", path: "/reports" },
    { icon: Sparkles, label: "AI Insights", path: "/ai-insights" },
    { icon: Settings, label: "Settings", path: "/settings" },
];