"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center font-medium transition-all duration-150",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                    "active:scale-[0.98]",

                    // Variants
                    {
                        default:
                            "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)]",
                        ghost:
                            "text-[var(--foreground)] hover:bg-[var(--background-hover)]",
                        outline:
                            "border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--background-hover)]",
                        danger:
                            "bg-[var(--error)] text-white hover:opacity-90",
                    }[variant],

                    // Sizes
                    {
                        sm: "h-7 px-2.5 text-xs rounded-[var(--radius-sm)]",
                        md: "h-9 px-4 text-sm rounded-[var(--radius-md)]",
                        lg: "h-11 px-6 text-base rounded-[var(--radius-lg)]",
                        icon: "h-8 w-8 rounded-[var(--radius-md)]",
                    }[size],

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
