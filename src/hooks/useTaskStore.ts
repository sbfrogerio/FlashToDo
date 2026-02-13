"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, SpicyLevel, TaskCategory } from "@/types";
import { generateId } from "@/lib/utils";

interface TaskStore {
    // State
    tasks: Task[];
    spicyLevel: SpicyLevel;

    // Task actions
    addTask: (text: string, category?: TaskCategory) => string;
    removeTask: (id: string) => void;
    toggleComplete: (id: string) => void;
    updateTaskText: (id: string, text: string) => void;
    setTaskCategory: (id: string, category: TaskCategory) => void;
    addSubtasks: (parentId: string, subtasks: string[], category?: TaskCategory) => void;
    reorderTasks: (activeId: string, overId: string) => void;
    clearCompleted: () => void;
    clearAll: () => void;

    // Settings
    setSpicyLevel: (level: SpicyLevel) => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set) => ({
            // Initial state
            tasks: [],
            spicyLevel: 3,

            // Add new task
            addTask: (text: string, category?: TaskCategory) => {
                const id = generateId();
                const newTask: Task = {
                    id,
                    text,
                    completed: false,
                    category,
                    subtasks: [],
                    createdAt: Date.now(),
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));
                return id;
            },

            // Remove task (and its subtasks) - recursively searches for the task
            removeTask: (id: string) => {
                const removeRecursive = (tasks: Task[]): Task[] =>
                    tasks
                        .filter((task) => task.id !== id)
                        .map((task) => ({
                            ...task,
                            subtasks: removeRecursive(task.subtasks),
                        }));

                set((state) => ({ tasks: removeRecursive(state.tasks) }));
            },

            // Toggle completion
            toggleComplete: (id: string) => {
                const toggleRecursive = (tasks: Task[]): Task[] =>
                    tasks.map((task) => {
                        if (task.id === id) {
                            const newCompleted = !task.completed;
                            return {
                                ...task,
                                completed: newCompleted,
                                subtasks: task.subtasks.map((st) => ({
                                    ...st,
                                    completed: newCompleted,
                                })),
                            };
                        }
                        return {
                            ...task,
                            subtasks: toggleRecursive(task.subtasks),
                        };
                    });

                set((state) => ({ tasks: toggleRecursive(state.tasks) }));
            },

            // Update task text
            updateTaskText: (id: string, text: string) => {
                const updateRecursive = (tasks: Task[]): Task[] =>
                    tasks.map((task) => {
                        if (task.id === id) {
                            return { ...task, text };
                        }
                        return { ...task, subtasks: updateRecursive(task.subtasks) };
                    });

                set((state) => ({ tasks: updateRecursive(state.tasks) }));
            },

            // Set task category
            setTaskCategory: (id: string, category: TaskCategory) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, category } : task
                    ),
                }));
            },

            // Add subtasks to a parent task
            addSubtasks: (parentId: string, subtaskTexts: string[], category?: TaskCategory) => {
                const addRecursive = (tasks: Task[]): Task[] =>
                    tasks.map((task) => {
                        if (task.id === parentId) {
                            const newSubtasks: Task[] = subtaskTexts.map((text) => ({
                                id: generateId(),
                                text,
                                completed: false,
                                category,
                                subtasks: [],
                                parentId,
                                createdAt: Date.now(),
                            }));
                            return {
                                ...task,
                                category: category || task.category,
                                subtasks: [...task.subtasks, ...newSubtasks],
                            };
                        }
                        return { ...task, subtasks: addRecursive(task.subtasks) };
                    });

                set((state) => ({ tasks: addRecursive(state.tasks) }));
            },

            // Reorder tasks
            reorderTasks: (activeId: string, overId: string) => {
                set((state) => {
                    const tasks = [...state.tasks];
                    const activeIndex = tasks.findIndex((t) => t.id === activeId);
                    const overIndex = tasks.findIndex((t) => t.id === overId);

                    if (activeIndex === -1 || overIndex === -1) return state;

                    const [removed] = tasks.splice(activeIndex, 1);
                    tasks.splice(overIndex, 0, removed);

                    return { tasks };
                });
            },

            // Clear completed tasks
            clearCompleted: () => {
                const clearRecursive = (tasks: Task[]): Task[] =>
                    tasks
                        .filter((task) => !task.completed)
                        .map((task) => ({
                            ...task,
                            subtasks: clearRecursive(task.subtasks),
                        }));

                set((state) => ({ tasks: clearRecursive(state.tasks) }));
            },

            // Clear all tasks
            clearAll: () => {
                set({ tasks: [] });
            },

            // Set spicy level
            setSpicyLevel: (level: SpicyLevel) => {
                set({ spicyLevel: level });
            },
        }),
        {
            name: "flash-todo-storage",
            partialize: (state) => ({
                tasks: state.tasks,
                spicyLevel: state.spicyLevel,
            }),
        }
    )
);
