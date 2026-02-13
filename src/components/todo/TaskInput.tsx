"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/hooks/useTaskStore";
import { motion } from "framer-motion";

export function TaskInput() {
    const [text, setText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const addTask = useTaskStore((state) => state.addTask);

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (trimmed) {
            addTask(trimmed);
            setText("");
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="relative flex gap-2">
                <Input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="O que você precisa fazer?"
                    variant="large"
                    className="pr-12"
                    autoFocus
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    size="lg"
                    title="Adicionar tarefa"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            <p className="mt-2 text-xs text-[var(--foreground-tertiary)] text-center">
                Adicione uma tarefa e clique em ⚡ para quebrá-la em passos
            </p>
        </motion.div>
    );
}
