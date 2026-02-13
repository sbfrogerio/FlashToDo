"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
            <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h1 className="font-semibold text-lg text-[var(--foreground)]">
                        Flash ToDo
                    </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        title={isDark ? "Modo claro" : "Modo escuro"}
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
}
