import { TrendingUp } from "lucide-react";
import { useState } from "react";

export const PhoneMockup = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative w-[320px] md:w-[400px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Phone frame with simplified hover effect */}
            <div
                className="relative bg-sidebar rounded-[3rem] p-3 shadow-2xl transition-transform duration-500 ease-out"
                style={{
                    transform: isHovered
                        ? "scale(1.02)"
                        : "rotate(2deg)",
                    willChange: 'transform',
                }}
            >
                {/* Edge highlight for 3D effect */}
                <div
                    className="absolute inset-0 rounded-[3rem] pointer-events-none bg-gradient-to-br from-white/10 to-transparent"
                />

                {/* Inner bezel */}
                <div className="bg-background rounded-[2.5rem] overflow-hidden relative">
                    {/* Screen glare */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-br from-white/10 to-transparent"
                    />

                    {/* Status bar */}
                    <div className="h-10 bg-primary flex items-center justify-center">
                        <div className="w-24 h-6 bg-sidebar rounded-full" />
                    </div>

                    {/* Screen content - Extended */}
                    <div className="p-5 space-y-5 pb-10">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-foreground">
                                Home
                            </h3>
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                    👤
                                </span>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground">
                            <p className="text-xs opacity-80 mb-1">
                                Total Balance
                            </p>
                            <p className="text-2xl font-bold">$12,450.00</p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs">
                                    +12.5% this month
                                </span>
                            </div>
                        </div>

                        {/* Action Cards */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                                        <span className="text-sm">📥</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-foreground">
                                            4 New Transactions
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            Awaiting review
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/10">
                                    Review
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                                        <span className="text-sm">💰</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-foreground">
                                            $1,000 Ready
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            To assign
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/10">
                                    Assign
                                </button>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-foreground">
                                    Top Priorities
                                </h4>
                                <span className="text-xs text-primary">
                                    See all
                                </span>
                            </div>

                            {[
                                {
                                    name: "Groceries",
                                    amount: "$450.00",
                                    progress: 75,
                                    color: "bg-primary",
                                },
                                {
                                    name: "Savings",
                                    amount: "$200.00",
                                    progress: 40,
                                    color: "bg-success",
                                },
                                {
                                    name: "Utilities",
                                    amount: "$125.00",
                                    progress: 60,
                                    color: "bg-warning",
                                },
                                {
                                    name: "Entertainment",
                                    amount: "$80.00",
                                    progress: 25,
                                    color: "bg-destructive",
                                },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                                            />
                                            <span className="text-sm text-foreground">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            {item.amount}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                            style={{
                                                width: `${item.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Monthly Summary */}
                        <div className="pt-4 mt-2 border-t border-border">
                            <h4 className="text-sm font-semibold text-foreground mb-3">
                                This Month
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-success/10 rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Available
                                    </p>
                                    <p className="text-lg font-bold text-success">
                                        $690.00
                                    </p>
                                </div>
                                <div className="bg-muted rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Spent
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                        $2,310.00
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex justify-around pt-4 border-t border-border">
                            {[
                                { icon: "📊", label: "Stats" },
                                { icon: "➕", label: "Add" },
                                { icon: "🔔", label: "Alerts" },
                            ].map((action, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                        <span className="text-lg">
                                            {action.icon}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {action.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
