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

export function Sidebar() {
    const [accountsOpen, setAccountsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const totalBalance = accounts.reduce((sum, account) => {
        return (sum += account.balance);
    }, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-sidebar-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg">BudgetFlow</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                            location.pathname === item.path
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Accounts Section */}
            <div className="flex-1 overflow-auto scrollbar-thin px-2 mt-4">
                <button
                    onClick={() => setAccountsOpen(!accountsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                >
                    <span>Accounts</span>
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform",
                            accountsOpen && "rotate-180"
                        )}
                    />
                </button>

                {accountsOpen && (
                    <div className="space-y-1 animate-fade-in">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer"
                            >
                                <span className="text-sm">{account.name}</span>
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        account.balance < 0
                                            ? "text-destructive"
                                            : "text-sidebar-foreground"
                                    )}
                                >
                                    {formatCurrency(account.balance)}
                                </span>
                            </div>
                        ))}

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-muted hover:text-sidebar-foreground transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Account
                        </button>
                    </div>
                )}
            </div>

            {/* Total Balance */}
            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-sidebar-muted">
                        Total Balance
                    </span>
                    <span className="text-lg font-semibold">
                        {formatCurrency(totalBalance)}
                    </span>
                </div>
            </div>
        </aside>
    );
}
