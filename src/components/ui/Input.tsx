"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "large";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <input
                className={cn(
                    // Base styles
                    "w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)]",
                    "border border-[var(--border)] rounded-[var(--radius-md)]",
                    "transition-all duration-150",
                    "focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",

                    // Variants
                    {
                        default: "h-9 px-3 text-sm",
                        large: "h-12 px-4 text-base",
                    }[variant],

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };
