"use client";

import { useState } from "react";
import { Check, Trash2, Zap, GripVertical, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, categoryEmoji } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/hooks/useTaskStore";
import { useGemini } from "@/hooks/useGemini";

interface TaskItemProps {
    task: Task;
    depth?: number;
}

export function TaskItem({ task, depth = 0 }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { toggleComplete, removeTask, addSubtasks, spicyLevel } = useTaskStore();
    const { decompose, isReady } = useGemini();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const hasSubtasks = task.subtasks.length > 0;

    const handleMagicClick = async () => {
        if (!isReady || isLoading) return;

        setIsLoading(true);
        try {
            const result = await decompose(task.text, spicyLevel);
            if (result && result.subtasks.length > 0) {
                addSubtasks(task.id, result.subtasks, result.category);
                setIsExpanded(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn("group", isDragging && "opacity-50")}
        >
            <div
                className={cn(
                    "flex items-center gap-2 py-2 px-2 rounded-[var(--radius-md)]",
                    "hover:bg-[var(--background-hover)] transition-colors",
                    depth > 0 && "ml-6"
                )}
            >
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] transition-opacity"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Expand/collapse for subtasks */}
                {hasSubtasks ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)]"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : (
                    <span className="w-4" />
                )}

                {/* Checkbox */}
                <button
                    onClick={() => toggleComplete(task.id)}
                    className={cn(
                        "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        task.completed
                            ? "bg-[var(--accent)] border-[var(--accent)]"
                            : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                    )}
                >
                    {task.completed && <Check className="h-3 w-3 text-white" />}
                </button>

                {/* Category emoji */}
                {task.category && (
                    <span className="text-sm" title={task.category}>
                        {categoryEmoji[task.category]}
                    </span>
                )}

                {/* Task text */}
                <span
                    className={cn(
                        "flex-1 text-sm text-[var(--foreground)]",
                        task.completed && "line-through text-[var(--foreground-tertiary)]"
                    )}
                >
                    {task.text}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Flash button - only for top-level tasks without subtasks */}
                    {depth === 0 && !hasSubtasks && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleMagicClick}
                            disabled={isLoading}
                            title="Decompor em subtarefas com IA"
                            className="h-7 w-7"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Zap className="h-4 w-4 text-[var(--accent)]" />
                                </motion.div>
                            ) : (
                                <Zap className="h-4 w-4 text-[var(--accent)]" />
                            )}
                        </Button>
                    )}

                    {/* Delete button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        title="Remover tarefa"
                        className="h-7 w-7 text-[var(--foreground-tertiary)] hover:text-[var(--error)]"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Subtasks */}
            <AnimatePresence>
                {isExpanded && hasSubtasks && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {task.subtasks.map((subtask) => (
                            <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
