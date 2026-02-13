# Flash ToDo ⚡

> Quebre tarefas grandes em passos simples com IA

Aplicação de lista de tarefas inteligente com integração Google Gemini para decomposição automática de tarefas complexas.

## ✨ Features

- **Decomposição AI** - Clique em ⚡ para quebrar tarefas em subtarefas
- **Nível de Potência** ⚡ - Controle a profundidade da decomposição (1-5)
- **Drag & Drop** - Reordene tarefas arrastando
- **Categorias** - Identificação automática com emojis
- **Dark Mode** - Tema claro/escuro
- **Export** - Copie para clipboard ou exporte JSON
- **Offline** - Funciona sem internet (exceto IA)
- **Mobile First** - Design responsivo

## 🚀 Demo

Acesse: [seu-usuario.github.io/flash-todo](https://seu-usuario.github.io/flash-todo)

## ⚙️ Configuração

1. **Obtenha uma API Key gratuita do Gemini:**
   - Acesse [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Clique em "Create API Key"
   - Copie a key gerada

2. **Configure no app:**
   - Clique no ícone ⚙️ no header
   - Cole sua API Key
   - Clique em "Salvar"

## 🛠️ Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/flash-todo.git
cd flash-todo

# Instale dependências
npm install

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📦 Deploy no GitHub Pages

1. Fork/clone este repositório
2. Vá em Settings > Pages
3. Em "Source", selecione "GitHub Actions"
4. Push qualquer mudança para a branch `main`
5. O deploy será automático!

Se estiver hospedando em `username.github.io/flash-todo`, descomente o `basePath` no `next.config.ts`:

```typescript
basePath: "/flash-todo",
```

## 🏗️ Tech Stack

| Tecnologia | Uso |
|------------|-----|
| Next.js 16 | Framework React |
| React 19 | UI Components |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animações |
| DnD Kit | Drag & Drop |
| Zustand | State Management |
| Google Gemini | AI para decomposição |

## 📄 Criador

**Rogério Bezerra**  
Advogado (OAB/AL 19.249) e Consultor em Inteligência Artificial

> *"Potencialize sua advocacia com Inteligência Artificial"*

- 📱 WhatsApp: (82) 9 8767-3811 | (82) 9 8116-2313
- 📸 Instagram: [@rogeriosbf](https://instagram.com/rogeriosbf)
- 💼 LinkedIn: [Rogério Bezerra](https://www.linkedin.com/in/rogeriosbf)
- 🌐 Site: [sbfrogerio.github.io/Rogerio-Bezerra](https://sbfrogerio.github.io/Rogerio-Bezerra/)

---

Feito com ☕️ e ❤️ em Maceió/AL
