/**
 * Task item structure
 */
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    category?: TaskCategory;
    subtasks: Task[];
    parentId?: string;
    createdAt: number;
}

/**
 * Spicy level for task decomposition depth
 * 1 = mild (few steps)
 * 5 = extreme (many detailed steps)
 */
export type SpicyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Task categories with emojis
 */
export type TaskCategory =
    | "work" // 💼
    | "personal" // 👤
    | "health" // 💪
    | "finance" // 💰
    | "learning" // 📚
    | "home" // 🏠
    | "social" // 👥
    | "creative" // 🎨
    | "tech" // 💻
    | "other"; // 📌

/**
 * Map category to emoji
 */
export const categoryEmoji: Record<TaskCategory, string> = {
    work: "💼",
    personal: "👤",
    health: "💪",
    finance: "💰",
    learning: "📚",
    home: "🏠",
    social: "👥",
    creative: "🎨",
    tech: "💻",
    other: "📌",
};

/**
 * Gemini API response for task decomposition
 */
export interface DecompositionResult {
    subtasks: string[];
    category: TaskCategory;
}
