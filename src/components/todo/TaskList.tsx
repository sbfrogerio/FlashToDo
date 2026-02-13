"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { useTaskStore } from "@/hooks/useTaskStore";
import { TaskItem } from "./TaskItem";

export function TaskList() {
    const { tasks, reorderTasks } = useTaskStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    if (tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
            >
                <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
                    <ClipboardList className="h-8 w-8 text-[var(--foreground-tertiary)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">
                    Nenhuma tarefa ainda
                </h3>
                <p className="text-sm text-[var(--foreground-secondary)] max-w-xs">
                    Adicione uma tarefa acima e use o raio ⚡ para quebrá-la em
                    passos simples
                </p>
            </motion.div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </AnimatePresence>
                </div>
            </SortableContext>
        </DndContext>
    );
}
