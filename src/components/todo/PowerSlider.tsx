"use client";

import { cn } from "@/lib/utils";
import { SpicyLevel } from "@/types";
import { useTaskStore } from "@/hooks/useTaskStore";
import { motion } from "framer-motion";

const levels: SpicyLevel[] = [1, 2, 3, 4, 5];

const levelDescriptions: Record<SpicyLevel, string> = {
    1: "Muito simples",
    2: "Simples",
    3: "Normal",
    4: "Detalhado",
    5: "Muito detalhado",
};

export function PowerSlider() {
    const { spicyLevel, setSpicyLevel } = useTaskStore();

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--foreground-secondary)]">
                Potência:
            </span>
            <div className="flex items-center gap-1">
                {levels.map((level) => (
                    <motion.button
                        key={level}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSpicyLevel(level)}
                        className={cn(
                            "text-xl transition-all duration-150 cursor-pointer",
                            level <= spicyLevel ? "opacity-100" : "opacity-30 grayscale"
                        )}
                        title={levelDescriptions[level]}
                    >
                        ⚡
                    </motion.button>
                ))}
            </div>
            <span className="text-xs text-[var(--foreground-tertiary)] min-w-[90px]">
                {levelDescriptions[spicyLevel]}
            </span>
        </div>
    );
}
