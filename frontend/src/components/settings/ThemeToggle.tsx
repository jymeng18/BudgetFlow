import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "relative w-20 h-10 rounded-full p-1 transition-all duration-500 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:scale-105 active:scale-95",
                isDark
                    ? "bg-sidebar-accent shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                    : "bg-primary/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
            )}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Track glow effect */}
            <div
                className={cn(
                    "absolute inset-0 rounded-full transition-opacity duration-500",
                    isDark
                        ? "opacity-100 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                        : "opacity-0"
                )}
            />

            {/* Thumb */}
            <div
                className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-out",
                    "shadow-lg",
                    isDark
                        ? "translate-x-10 bg-sidebar-primary rotate-[360deg]"
                        : "translate-x-0 bg-warning rotate-0"
                )}
            >
                {/* Icon container with crossfade */}
                <div className="relative w-5 h-5">
                    <Sun
                        className={cn(
                            "absolute inset-0 w-5 h-5 text-warning-foreground transition-all duration-300",
                            isDark
                                ? "opacity-0 scale-50"
                                : "opacity-100 scale-100"
                        )}
                    />
                    <Moon
                        className={cn(
                            "absolute inset-0 w-5 h-5 text-sidebar-primary-foreground transition-all duration-300",
                            isDark
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-50"
                        )}
                    />
                </div>

                {/* Pulse ring on hover */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300",
                        "group-hover:animate-ping",
                        isDark ? "bg-sidebar-primary/30" : "bg-warning/30"
                    )}
                />
            </div>

            {/* Stars decoration for dark mode */}
            <div
                className={cn(
                    "absolute top-1.5 left-2 w-1 h-1 rounded-full bg-sidebar-foreground/60 transition-all duration-500",
                    isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )}
            />
            <div
                className={cn(
                    "absolute bottom-2 left-4 w-0.5 h-0.5 rounded-full bg-sidebar-foreground/40 transition-all duration-700",
                    isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
                )}
            />
        </button>
    );
}
