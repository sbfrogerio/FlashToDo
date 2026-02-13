import { GoogleGenerativeAI } from "@google/generative-ai";
import { DecompositionResult, SpicyLevel, TaskCategory } from "@/types";
import {
    createDecompositionPrompt,
    createCategorizationPrompt,
    validateCategory,
} from "./prompts";

// API Key - Gemini
const GEMINI_API_KEY = "AIzaSyAcjevflXQoLYo_gNAdn5qdoW8ZhSvxTsQ";

// Gemini client - initialized only if API key is available
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        if (!GEMINI_API_KEY) {
            throw new Error("API Key do Gemini não configurada");
        }
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    return genAI;
}

/**
 * Check if Gemini is initialized
 */
export function isGeminiInitialized(): boolean {
    return !!GEMINI_API_KEY;
}

/**
 * Get the Gemini model
 */
function getModel() {
    return getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });
}

/**
 * Decompose a task into subtasks using Gemini
 */
export async function decomposeTask(
    task: string,
    spicyLevel: SpicyLevel
): Promise<DecompositionResult> {
    const model = getModel();
    const prompt = createDecompositionPrompt(task, spicyLevel);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = response;
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        // Parse JSON
        const parsed = JSON.parse(jsonStr.trim());

        // Validate structure
        if (!parsed.subtasks || !Array.isArray(parsed.subtasks)) {
            throw new Error("Resposta inválida do AI");
        }

        return {
            subtasks: parsed.subtasks.filter(
                (s: unknown) => typeof s === "string" && s.trim()
            ),
            category: validateCategory(parsed.category || "other"),
        };
    } catch (error) {
        console.error("Erro ao decompor tarefa:", error);
        throw new Error("Falha ao processar com IA. Tente novamente.");
    }
}

/**
 * Categorize a task using Gemini
 */
export async function categorizeTask(task: string): Promise<TaskCategory> {
    const model = getModel();
    const prompt = createCategorizationPrompt(task);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return validateCategory(response);
    } catch (error) {
        console.error("Erro ao categorizar tarefa:", error);
        return "other";
    }
}
