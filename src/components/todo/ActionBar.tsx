"use client";

import { Download, Trash2, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/hooks/useTaskStore";

export function ActionBar() {
    const { tasks, clearCompleted, clearAll } = useTaskStore();
    const [copied, setCopied] = useState(false);

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;

    const handleCopyToClipboard = async () => {
        const formatTasks = (
            taskList: typeof tasks,
            indent = ""
        ): string => {
            return taskList
                .map((task) => {
                    const checkbox = task.completed ? "[x]" : "[ ]";
                    const line = `${indent}${checkbox} ${task.text}`;
                    const subtasks = task.subtasks.length
                        ? "\n" + formatTasks(task.subtasks, indent + "  ")
                        : "";
                    return line + subtasks;
                })
                .join("\n");
        };

        const text = formatTasks(tasks);
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(tasks, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `magic-todo-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (totalCount === 0) return null;

    return (
        <div className="flex items-center justify-between py-3 border-t border-[var(--border)]">
            {/* Stats */}
            <span className="text-sm text-[var(--foreground-secondary)]">
                {completedCount}/{totalCount} concluídas
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {/* Copy to clipboard */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyToClipboard}
                    title="Copiar para área de transferência"
                >
                    {copied ? (
                        <CheckCheck className="h-4 w-4 text-[var(--success)]" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>

                {/* Export JSON */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportJSON}
                    title="Exportar JSON"
                >
                    <Download className="h-4 w-4" />
                </Button>

                {/* Clear completed */}
                {completedCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCompleted}
                        title="Limpar concluídas"
                    >
                        Limpar concluídas
                    </Button>
                )}

                {/* Clear all */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    title="Limpar tudo"
                    className="text-[var(--error)]"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
