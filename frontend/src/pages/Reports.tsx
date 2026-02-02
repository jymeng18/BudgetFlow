/**
 * Filename: Reports.tsx
 *
 * Desc: Graph/Reports about your spending habits
 *
 * Author: Jerry Meng
 *
 * Last Modified: Jan 2026
 */

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Tag,
  Percent,
  DollarSign,
  Receipt,
  User,
  Users,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAnalytics, type AnalyticsData } from "@/lib/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

type BudgetType = "personal" | "shared" | "family";

const budgetTypes = [
  { id: "personal" as const, label: "Personal", icon: User },
  { id: "shared" as const, label: "Shared", icon: Users },
  { id: "family" as const, label: "Family", icon: Home },
];

const Reports = () => {
  const [budgetType, setBudgetType] = useState<BudgetType>("personal");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [budgetType]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalytics(budgetType);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Doughnut Chart - Money Flow (Income vs Expenses vs Remaining)
  const doughnutData = analytics
    ? {
        labels: ["Expenses", "Remaining"],
        datasets: [
          {
            data: [
              analytics.totalExpenses,
              Math.max(0, analytics.totalIncome - analytics.totalExpenses),
            ],
            backgroundColor: ["#1e3a8a", "#60a5fa"],
            borderColor: ["#1e3a8a", "#60a5fa"],
            borderWidth: 2,
          },
        ],
      }
    : null;

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; raw: unknown }) => {
            const value = context.raw as number;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    cutout: "60%",
  };

  // Horizontal Bar Chart - Top Expenses & Remaining
  const horizontalBarData = analytics
    ? {
        labels: [
          ...analytics.top3Expenses.map((e) => e.name),
          ...analytics.top3Remaining.map((r) => r.name),
        ],
        datasets: [
          {
            label: "Spent",
            data: [
              ...analytics.top3Expenses.map((e) => e.spent),
              0,
              0,
              0,
            ],
            backgroundColor: "#1e3a8a",
            borderRadius: 4,
          },
          {
            label: "Remaining",
            data: [
              0,
              0,
              0,
              ...analytics.top3Remaining.map((r) => r.available),
            ],
            backgroundColor: "#60a5fa",
            borderRadius: 4,
          },
        ],
      }
    : null;

  const horizontalBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; raw: unknown }) => {
            const value = context.raw as number;
            if (value === 0) return "";
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          callback: function (tickValue: string | number) {
            const value =
              typeof tickValue === "string"
                ? parseFloat(tickValue)
                : tickValue;
            return formatCurrency(value);
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Vertical Bar Chart - Transaction Counts
  const verticalBarData = analytics
    ? {
        labels: ["Expense Transactions", "Income Transactions"],
        datasets: [
          {
            label: "Transactions",
            data: [
              analytics.expenseTransactions,
              analytics.totalTransactions - analytics.expenseTransactions,
            ],
            backgroundColor: ["#1e3a8a", "#60a5fa"],
            borderRadius: 6,
            barThickness: 60,
          },
        ],
      }
    : null;

  const verticalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { raw: unknown }) => {
            return `Count: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  // KPI Cards Data
  const kpiCards = analytics
    ? [
        {
          title: "Net Income",
          value: formatCurrency(analytics.netIncome),
          icon: analytics.netIncome >= 0 ? TrendingUp : TrendingDown,
          color:
            analytics.netIncome >= 0
              ? "text-success"
              : "text-destructive",
          bgColor:
            analytics.netIncome >= 0
              ? "bg-success/10"
              : "bg-destructive/10",
        },
        {
          title: "Targets Completed",
          value: analytics.targetsCompleted.toString(),
          icon: Target,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          title: "Critical Targets",
          value: analytics.criticalTargets.length.toString(),
          icon: AlertTriangle,
          color:
            analytics.criticalTargets.length > 0
              ? "text-destructive"
              : "text-muted-foreground",
          bgColor:
            analytics.criticalTargets.length > 0
              ? "bg-destructive/10"
              : "bg-muted",
        },
        {
          title: "Most Frequent",
          value: analytics.mostFrequentCategory || "N/A",
          icon: Tag,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          title: "Not Spent",
          value: `${analytics.percentageNotSpent.toFixed(1)}%`,
          icon: Percent,
          color:
            analytics.percentageNotSpent >= 20
              ? "text-success"
              : "text-warning",
          bgColor:
            analytics.percentageNotSpent >= 20
              ? "bg-success/10"
              : "bg-warning/10",
        },
        {
          title: "Avg Transaction",
          value: formatCurrency(analytics.averageTransactionAmount),
          icon: DollarSign,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          title: "Total Transactions",
          value: analytics.totalTransactions.toString(),
          icon: Receipt,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
      ]
    : [];

  return (
    <div
      className="flex min-h-screen bg-background"

    >
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto ml-64">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize your financial data and track spending patterns
          </p>
        </div>

        {/* Budget Type Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
            {budgetTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setBudgetType(type.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  budgetType === type.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {kpiCards.map((kpi, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className={cn("p-2 rounded-lg w-fit", kpi.bgColor)}>
                        <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground leading-tight break-words">
                          {kpi.title}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-semibold truncate",
                            kpi.title === "Net Income" && kpi.color,
                            kpi.title === "Most Frequent" && "text-foreground"
                          )}
                          title={kpi.value}
                        >
                          {kpi.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Doughnut Chart - Money Flow */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Money Flow
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Income breakdown: Expenses vs Remaining
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {doughnutData && (
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(analytics.totalIncome)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Income
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Horizontal Bar Chart - Top Categories */}
              <Card className="border-border xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Top Categories
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Highest spending vs Most budget remaining
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    {horizontalBarData && (
                      <Bar
                        data={horizontalBarData}
                        options={horizontalBarOptions}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vertical Bar Chart - Transaction Counts */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Transaction Breakdown
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Expense vs Income transaction counts
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {verticalBarData && (
                      <Bar
                        data={verticalBarData}
                        options={verticalBarOptions}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card - Budget Type Info */}
              <Card className="border-border lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    {budgetType.charAt(0).toUpperCase() + budgetType.slice(1)}{" "}
                    Budget Summary
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Key metrics at a glance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(analytics.totalIncome)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total Income
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-destructive">
                        {formatCurrency(analytics.totalExpenses)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total Expenses
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          analytics.netIncome >= 0
                            ? "text-success"
                            : "text-destructive"
                        )}
                      >
                        {formatCurrency(analytics.netIncome)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Net Income
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">
                        {analytics.percentageNotSpent.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Savings Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Targets Warning */}
            {analytics.criticalTargets.length > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Critical Budget Alerts
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Categories that have exceeded their budget
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analytics.criticalTargets.map((target, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">No data available</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
