/**
 * Filename: Settings.tsx
 *
 * Desc: User settings customization, ex: dark mode, 
 *
 * Author: Jerry Meng
 *
 * Last Modified: Dec 2025
 */

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { User } from "lucide-react";

export default function Settings() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const handleThemeToggle = () => {
        setIsDark(!isDark);
    };

    return (
      <div
        className="flex min-h-screen bg-background"

      >
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto ml-64">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account preferences
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
}