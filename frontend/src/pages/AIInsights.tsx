/**
 * Filename: AIInsights.tsx
 * 
 * Desc: Built in AI-Chatbot that runs Gemini-2.5 Flash model 
 * to analyze your spending habits
 * 
 * Author: Jerry Meng
 * 
 * Last Modified: Dec 2025
 */

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Send,
  Lightbulb,
  TrendingUp,
  PiggyBank,
  AlertCircle,
} from "lucide-react";

const AIInsights = () => {
  const [prompt, setPrompt] = useState("");

  const suggestedPrompts = [
    { icon: TrendingUp, text: "Where am I overspending this month?" },
    { icon: PiggyBank, text: "How can I save more money?" },
    { icon: AlertCircle, text: "Am I on track with my budget?" },
    { icon: Lightbulb, text: "Give me tips to reduce expenses" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Get personalized financial insights powered by AI
          </p>
        </div>

        {/* Main Chat Area */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-success/5">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">
                Ask me anything about your finances
              </CardTitle>
              <CardDescription className="text-base">
                I can analyze your spending patterns, suggest savings
                opportunities, and help you reach your financial goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="flex gap-3">
                <Input
                  placeholder="Ask about your budget, spending habits, or savings goals..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-12 text-base"
                />
                <Button
                  size="lg"
                  className="h-12 px-6 bg-primary hover:bg-primary/90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Suggested Prompts */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">
                  Suggested questions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedPrompts.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(item.text)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-foreground">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground text-center">
                    Our AI Assistant utilizes DeepSeek's V3 Model! 
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;