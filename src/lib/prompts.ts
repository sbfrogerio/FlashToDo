import { SpicyLevel, TaskCategory } from "@/types";

/**
 * Create the system prompt for task decomposition
 */
export function createDecompositionPrompt(
    task: string,
    spicyLevel: SpicyLevel
): string {
    const stepsGuidance = {
        1: "2-3 passos simples e diretos",
        2: "3-5 passos claros",
        3: "5-7 passos detalhados",
        4: "7-10 passos bem detalhados",
        5: "10-15 passos muito detalhados e específicos",
    };

    return `Você é um assistente especializado em quebrar tarefas complexas em passos simples e acionáveis.

TAREFA DO USUÁRIO: "${task}"

NÍVEL DE DETALHAMENTO: ${spicyLevel}/5 (${stepsGuidance[spicyLevel]})

INSTRUÇÕES:
1. Analise a tarefa e quebre em ${stepsGuidance[spicyLevel]}
2. Cada passo deve ser claro, específico e acionável
3. Use verbos de ação no início de cada passo
4. Os passos devem seguir uma ordem lógica
5. Classifique a tarefa em uma categoria

CATEGORIAS DISPONÍVEIS:
- work (trabalho, escritório, reuniões)
- personal (pessoal, autocuidado)
- health (saúde, exercícios, médico)
- finance (finanças, banco, investimentos)
- learning (estudo, cursos, leitura)
- home (casa, limpeza, organização)
- social (social, eventos, amigos)
- creative (criatividade, arte, hobbies)
- tech (tecnologia, programação, computador)
- other (outros)

RESPONDA APENAS COM JSON VÁLIDO no formato:
{
  "category": "work",
  "subtasks": [
    "Primeiro passo específico",
    "Segundo passo específico",
    "..."
  ]
}

Não inclua explicações fora do JSON. Responda apenas com o JSON.`;
}

/**
 * Create prompt for categorizing a single task
 */
export function createCategorizationPrompt(task: string): string {
    return `Classifique esta tarefa em UMA categoria:

TAREFA: "${task}"

CATEGORIAS:
- work (trabalho, escritório, reuniões)
- personal (pessoal, autocuidado)
- health (saúde, exercícios, médico)
- finance (finanças, banco, investimentos)
- learning (estudo, cursos, leitura)
- home (casa, limpeza, organização)
- social (social, eventos, amigos)
- creative (criatividade, arte, hobbies)
- tech (tecnologia, programação, computador)
- other (outros)

Responda APENAS com a categoria, nada mais. Exemplo: work`;
}

/**
 * Validate the category response
 */
export function validateCategory(response: string): TaskCategory {
    const validCategories: TaskCategory[] = [
        "work",
        "personal",
        "health",
        "finance",
        "learning",
        "home",
        "social",
        "creative",
        "tech",
        "other",
    ];

    const cleaned = response.toLowerCase().trim();

    if (validCategories.includes(cleaned as TaskCategory)) {
        return cleaned as TaskCategory;
    }

    return "other";
}
