/**
 * Filename: AIInsights.tsx
 * 
 * Desc: Built in AI-Chatbot that runs Gemini-2.5 Flash model 
 * to analyze your spending habits
 * 
 * Author: Jerry Meng
 * 
 * Last Modified: Jan 2026
 */

import { useState, useRef, useEffect } from "react";
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
  Loader2,
  User,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AIInsights = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { icon: TrendingUp, text: "Where am I overspending this month?" },
    { icon: PiggyBank, text: "How can I save more money?" },
    { icon: AlertCircle, text: "Am I on track with my budget?" },
    { icon: Lightbulb, text: "Give me tips to reduce expenses" },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      // Build conversation history (exclude system messages, only user/assistant)
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await sendChatMessage(textToSend, conversationHistory);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className="flex min-h-screen bg-background"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <div className="p-6 lg:p-8 pb-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Get personalized financial insights powered by AI
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col px-6 lg:px-8 pb-6 min-h-0">
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col min-h-0">
            {!hasMessages ? (
              /* Initial State - Welcome Card */
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-success/5">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">
                    Ask me anything about your finances
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt Input */}
                  <div className="flex gap-3">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-12 text-base"
                    />
                    <Button
                      size="lg"
                      onClick={() => handleSendMessage()}
                      disabled={!prompt.trim() || isLoading}
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
                          onClick={() => handleSendMessage(item.text)}
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
            ) : (
              /* Chat Messages */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="border-t border-border pt-4 bg-background">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type your message..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                    <Button
                      size="lg"
                      onClick={() => handleSendMessage()}
                      disabled={!prompt.trim() || isLoading}
                      className="h-12 px-6 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;