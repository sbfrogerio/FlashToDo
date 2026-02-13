/**
 * Gemini AI Module - Task Breakdown
 */

const Gemini = {
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

  /**
   * Break down a goal into actionable tasks
   */
  async breakdownGoal(goal, apiKey) {
    const prompt = `Você é um assistente de produtividade especializado em ajudar pessoas a organizarem suas tarefas.

Dado o objetivo abaixo, quebre-o em 3 a 7 tarefas práticas e acionáveis.

As tarefas devem ser:
- Claras e específicas
- Começar com verbos de ação
- Realizáveis em uma sessão de trabalho
- Ordenadas logicamente

OBJETIVO: "${goal}"

Responda APENAS com um JSON array de strings, sem explicações adicionais:
["tarefa 1", "tarefa 2", "tarefa 3"]`;

    return this.makeRequest(prompt, apiKey);
  },

  /**
   * Break down a specific task into subtasks
   */
  async breakdownTask(task, apiKey) {
    const prompt = `Você é um assistente de produtividade especializado em ajudar pessoas a organizarem suas tarefas.

Dado a tarefa abaixo, quebre-a em 2 a 5 passos menores e mais específicos.

Os passos devem ser:
- Muito específicos e imediatamente acionáveis
- Curtos e diretos
- Fáceis de completar rapidamente

TAREFA: "${task}"

Responda APENAS com um JSON array de strings, sem explicações adicionais:
["passo 1", "passo 2", "passo 3"]`;

    return this.makeRequest(prompt, apiKey);
  },

  /**
   * Make API request to Gemini
   */
  async makeRequest(prompt, apiKey) {
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API do Gemini');
      }

      const data = await response.json();
      
      // Extract text from response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Resposta vazia do Gemini');
      }

      // Parse JSON from response
      return this.parseResponse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  },

  /**
   * Parse JSON array from AI response
   */
  parseResponse(text) {
    // Try to extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error('Formato de resposta inválido');
    }

    try {
      const tasks = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(tasks)) {
        throw new Error('Resposta não é um array');
      }

      // Clean and validate tasks
      return tasks
        .filter(t => typeof t === 'string' && t.trim())
        .map(t => t.trim());
    } catch (e) {
      throw new Error('Erro ao processar resposta da IA');
    }
  },

  /**
   * Validate API key format
   */
  validateApiKey(key) {
    return key && key.trim().length > 10 && key.startsWith('AIza');
  }
};
