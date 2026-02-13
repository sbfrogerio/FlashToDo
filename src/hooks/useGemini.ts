"use client";

import { useState, useCallback } from "react";
import { decomposeTask, isGeminiInitialized } from "@/lib/gemini";
import { DecompositionResult, SpicyLevel } from "@/types";

interface UseGeminiReturn {
    isReady: boolean;
    isLoading: boolean;
    error: string | null;
    decompose: (
        task: string,
        spicyLevel: SpicyLevel
    ) => Promise<DecompositionResult | null>;
}

/**
 * Hook for using Gemini AI decomposition
 * A API Key já está integrada no projeto
 */
export function useGemini(): UseGeminiReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Com a key integrada, o Gemini está sempre pronto
    const isReady = isGeminiInitialized();

    const decompose = useCallback(
        async (
            task: string,
            spicyLevel: SpicyLevel
        ): Promise<DecompositionResult | null> => {
            if (!isReady) {
                setError("Gemini não está disponível");
                return null;
            }

            setIsLoading(true);
            setError(null);

            try {
                const result = await decomposeTask(task, spicyLevel);
                return result;
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Erro ao decompor tarefa";
                setError(message);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [isReady]
    );

    return {
        isReady,
        isLoading,
        error,
        decompose,
    };
}
