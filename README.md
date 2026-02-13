# ✨ Smart ToDo

Transforme seus objetivos em tarefas acionáveis com IA.

![Notion-inspired design](https://img.shields.io/badge/Design-Notion%20Inspired-F7F6F3?style=flat-square)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5-4285F4?style=flat-square)
![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-5FB67A?style=flat-square)

## 🚀 Como Usar

### 1. Obter API Key (Gratuita)

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Abrir o App

Simplesmente abra o arquivo `index.html` no seu navegador.

### 3. Configurar

1. No primeiro acesso, um modal pedirá sua API key
2. Cole a chave e clique em "Salvar"
3. Pronto!

### 4. Criar Tarefas

1. Digite seu objetivo (ex: "Organizar meu quarto")
2. Clique em **✨ Criar Tarefas**
3. A IA vai quebrar em subtarefas acionáveis
4. Clique ✨ em qualquer subtarefa para detalhá-la ainda mais

## ✨ Funcionalidades

| Feature                  | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| **Magic Breakdown**      | IA quebra objetivos em tarefas práticas   |
| **Subtarefas Aninhadas** | Quebre tarefas em passos cada vez menores |
| **Drag & Drop**          | Reordene tarefas arrastando               |
| **Undo/Redo**            | Ctrl+Z / Ctrl+Shift+Z para desfazer       |
| **Export JSON**          | Backup completo das suas tarefas          |
| **Export CSV**           | Formato compatível com Google Tasks       |
| **Persistência**         | Tudo salvo automaticamente no navegador   |

## 📂 Estrutura

```
smart-todo/
├── index.html      # Página principal
├── css/
│   └── styles.css  # Design system completo
├── js/
│   ├── app.js      # Lógica principal
│   ├── gemini.js   # Integração com IA
│   ├── storage.js  # LocalStorage + Export
│   └── ui.js       # Renderização
└── README.md       # Este arquivo
```

## 🎨 Design

- Inspirado no **Notion** - clean e minimalista
- Paleta de cores quentes e acolhedoras
- Tipografia **Inter** para legibilidade
- Animações sutis e micro-interações
- Totalmente responsivo

## 🔒 Privacidade

- Sua API key fica **apenas no seu navegador**
- Nenhum dado é enviado para servidores externos (além do Gemini)
- Tudo funciona offline após o primeiro carregamento

## 📤 Export para Google Tasks

1. Clique no ícone de export (↑)
2. Escolha "CSV"
3. Importe manualmente no Google Tasks

---

Feito com 💜 usando Gemini AI
