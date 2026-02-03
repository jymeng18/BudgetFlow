import {
  Wallet,
  PiggyBank,
  TrendingUp,
  Settings,
  Plus,
  ChevronDown,
  Sparkles,
  LogOut,
  TableRowsSplit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";

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
  const queryClient = useQueryClient();

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

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <ToastContainer position="top-right" autoClose={3000} />
        <button
          onClick={async () => {
            try {
              await signOut();
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user_id");
              queryClient.clear(); // Clear all cached data on logout

              toast.success("Logged out successfully");
              setTimeout(() => {
                  navigate("/");
              }, 1200);
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
