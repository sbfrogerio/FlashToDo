/**
 * Smart ToDo - Main Application
 */

const App = {
  state: {
    tasks: [],
    // API Key integrada diretamente
    apiKey: 'AIzaSyAdMbY4Ska5RJpa9IrnVxa25Tt9BDDNngs',
    history: [],
    historyIndex: -1,
    maxHistory: 50
  },

  init() {
    // Initialize UI
    UI.init();
    
    // Load saved data
    this.loadSavedData();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initial render
    UI.renderTasks(this.state.tasks);
    this.updateUndoRedoState();
    
    // API key já está integrada, pronto para usar!
    UI.showToast('Pronto para criar tarefas! ✨', 'success');
  },

  loadSavedData() {
    this.state.tasks = Storage.loadTasks();
    
    // Preservar API key padrão se não houver uma salva
    const savedApiKey = Storage.loadApiKey();
    if (savedApiKey) {
      this.state.apiKey = savedApiKey;
    }
    
    const historyData = Storage.loadHistory();
    this.state.history = historyData.history;
    this.state.historyIndex = historyData.index;
  },

  setupEventListeners() {
    // Magic button - create tasks
    UI.elements.magicBtn.addEventListener('click', () => this.handleMagicClick());
    
    // Enter key in goal input
    UI.elements.goalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleMagicClick();
      }
    });
    
    // Task list interactions (delegation)
    UI.elements.tasksList.addEventListener('click', (e) => this.handleTaskListClick(e));
    UI.elements.tasksList.addEventListener('change', (e) => this.handleTaskListChange(e));
    
    // Drag & Drop
    this.setupDragAndDrop();
    
    // Header buttons
    UI.elements.settingsBtn.addEventListener('click', () => {
      UI.showSettingsModal(this.state.apiKey);
    });
    
    UI.elements.importBtn.addEventListener('click', () => {
      UI.elements.importInput.click();
    });
    
    UI.elements.exportBtn.addEventListener('click', () => {
      if (this.state.tasks.length === 0) {
        UI.showToast('Nenhuma tarefa para exportar', 'error');
        return;
      }
      UI.showExportModal();
    });
    
    UI.elements.undoBtn.addEventListener('click', () => this.undo());
    UI.elements.redoBtn.addEventListener('click', () => this.redo());
    UI.elements.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    
    // Settings Modal
    UI.elements.settingsClose.addEventListener('click', () => UI.hideSettingsModal());
    UI.elements.settingsCancel.addEventListener('click', () => UI.hideSettingsModal());
    UI.elements.settingsSave.addEventListener('click', () => this.saveApiKey());
    
    // Export Modal
    UI.elements.exportClose.addEventListener('click', () => UI.hideExportModal());
    UI.elements.exportJSON.addEventListener('click', () => this.exportJSON());
    UI.elements.exportCSV.addEventListener('click', () => this.exportCSV());
    UI.elements.exportText.addEventListener('click', () => this.exportText());
    
    // Import
    UI.elements.importInput.addEventListener('change', (e) => this.handleImport(e));
    
    // Close modal on backdrop click
    UI.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === UI.elements.settingsModal) UI.hideSettingsModal();
    });
    
    UI.elements.exportModal.addEventListener('click', (e) => {
      if (e.target === UI.elements.exportModal) UI.hideExportModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) this.redo();
          else this.undo();
        }
      }
    });
  },

  // === Magic Breakdown ===
  async handleMagicClick() {
    const goal = UI.getGoalInput();
    
    if (!goal) {
      UI.showToast('Digite um objetivo primeiro', 'error');
      return;
    }
    
    if (!this.state.apiKey) {
      UI.showSettingsModal();
      UI.showToast('Configure sua API key primeiro', 'error');
      return;
    }
    
    UI.setLoading(true);
    
    try {
      const subtasks = await Gemini.breakdownGoal(goal, this.state.apiKey);
      
      // Create new task with subtasks
      const newTask = {
        id: Storage.generateId(),
        text: goal,
        completed: false,
        subtasks: subtasks.map(text => ({
          id: Storage.generateId(),
          text,
          completed: false,
          subtasks: []
        }))
      };
      
      this.saveToHistory();
      this.state.tasks.unshift(newTask);
      this.saveTasks();
      
      UI.clearGoalInput();
      UI.renderTasks(this.state.tasks);
      UI.showToast('Tarefas criadas com sucesso! ✨', 'success');
      
    } catch (error) {
      console.error('Magic breakdown error:', error);
      UI.showToast(error.message || 'Erro ao processar. Tente novamente.', 'error');
    } finally {
      UI.setLoading(false);
    }
  },

  // === Task Breakdown (subtask) ===
  async breakdownTask(taskId, isSubtask = false, parentId = null) {
    const task = isSubtask ? this.findSubtask(parentId, taskId) : this.findTask(taskId);
    
    if (!task) return;
    
    if (!this.state.apiKey) {
      UI.showSettingsModal();
      return;
    }
    
    UI.setTaskLoading(taskId, true);
    
    try {
      const newSubtasks = await Gemini.breakdownTask(task.text, this.state.apiKey);
      
      this.saveToHistory();
      
      // Add new subtasks
      task.subtasks = task.subtasks || [];
      newSubtasks.forEach(text => {
        task.subtasks.push({
          id: Storage.generateId(),
          text,
          completed: false,
          subtasks: []
        });
      });
      
      this.saveTasks();
      UI.renderTasks(this.state.tasks);
      UI.showToast('Subtarefas adicionadas! ✨', 'success');
      
    } catch (error) {
      console.error('Task breakdown error:', error);
      UI.showToast(error.message || 'Erro ao processar', 'error');
    } finally {
      UI.setTaskLoading(taskId, false);
    }
  },

  // === Event Handlers ===
  handleTaskListClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    
    const action = btn.dataset.action;
    const taskItem = btn.closest('.task-item');
    const subtaskItem = btn.closest('.subtask-item');
    
    if (subtaskItem) {
      const subtaskId = subtaskItem.dataset.id;
      const parentId = taskItem.dataset.id;
      
      if (action === 'breakdown') {
        this.breakdownTask(subtaskId, true, parentId);
      } else if (action === 'delete') {
        this.deleteSubtask(parentId, subtaskId);
      }
    } else if (taskItem) {
      const taskId = taskItem.dataset.id;
      
      if (action === 'breakdown') {
        this.breakdownTask(taskId);
      } else if (action === 'delete') {
        this.deleteTask(taskId);
      }
    }
  },

  handleTaskListChange(e) {
    const checkbox = e.target;
    if (checkbox.type !== 'checkbox') return;
    
    const taskItem = checkbox.closest('.task-item');
    const subtaskItem = checkbox.closest('.subtask-item');
    
    this.saveToHistory();
    
    if (subtaskItem) {
      const subtaskId = subtaskItem.dataset.id;
      const parentId = taskItem.dataset.id;
      this.toggleSubtask(parentId, subtaskId);
    } else if (taskItem) {
      const taskId = taskItem.dataset.id;
      this.toggleTask(taskId);
    }
  },

  // === Task Operations ===
  findTask(id) {
    return this.state.tasks.find(t => t.id === id);
  },

  findSubtask(parentId, subtaskId) {
    const parent = this.findTask(parentId);
    if (!parent || !parent.subtasks) return null;
    
    // Recursive search for nested subtasks
    const findInSubtasks = (subtasks) => {
      for (const sub of subtasks) {
        if (sub.id === subtaskId) return sub;
        if (sub.subtasks) {
          const found = findInSubtasks(sub.subtasks);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findInSubtasks(parent.subtasks);
  },

  toggleTask(id) {
    const task = this.findTask(id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      UI.renderTasks(this.state.tasks);
    }
  },

  toggleSubtask(parentId, subtaskId) {
    const subtask = this.findSubtask(parentId, subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      this.saveTasks();
      UI.renderTasks(this.state.tasks);
    }
  },

  deleteTask(id) {
    this.saveToHistory();
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
    UI.showToast('Tarefa excluída');
  },

  deleteSubtask(parentId, subtaskId) {
    const parent = this.findTask(parentId);
    if (!parent || !parent.subtasks) return;
    
    this.saveToHistory();
    
    const removeFromSubtasks = (subtasks) => {
      const index = subtasks.findIndex(s => s.id === subtaskId);
      if (index !== -1) {
        subtasks.splice(index, 1);
        return true;
      }
      for (const sub of subtasks) {
        if (sub.subtasks && removeFromSubtasks(sub.subtasks)) return true;
      }
      return false;
    };
    
    removeFromSubtasks(parent.subtasks);
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
  },

  clearCompleted() {
    const hasCompleted = this.state.tasks.some(t => t.completed);
    if (!hasCompleted) {
      UI.showToast('Nenhuma tarefa concluída para limpar');
      return;
    }
    
    this.saveToHistory();
    this.state.tasks = this.state.tasks.filter(t => !t.completed);
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
    UI.showToast('Tarefas concluídas removidas');
  },

  // === Drag & Drop ===
  setupDragAndDrop() {
    let draggedItem = null;
    
    UI.elements.tasksList.addEventListener('dragstart', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      
      draggedItem = taskItem;
      taskItem.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    
    UI.elements.tasksList.addEventListener('dragend', (e) => {
      if (draggedItem) {
        draggedItem.classList.remove('is-dragging');
        draggedItem = null;
      }
      
      document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
      });
    });
    
    UI.elements.tasksList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const taskItem = e.target.closest('.task-item');
      
      if (taskItem && taskItem !== draggedItem) {
        document.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });
        taskItem.classList.add('drag-over');
      }
    });
    
    UI.elements.tasksList.addEventListener('drop', (e) => {
      e.preventDefault();
      
      const targetItem = e.target.closest('.task-item');
      if (!targetItem || !draggedItem || targetItem === draggedItem) return;
      
      const draggedId = draggedItem.dataset.id;
      const targetId = targetItem.dataset.id;
      
      this.saveToHistory();
      this.reorderTasks(draggedId, targetId);
    });
  },

  reorderTasks(fromId, toId) {
    const fromIndex = this.state.tasks.findIndex(t => t.id === fromId);
    const toIndex = this.state.tasks.findIndex(t => t.id === toId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    const [moved] = this.state.tasks.splice(fromIndex, 1);
    this.state.tasks.splice(toIndex, 0, moved);
    
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
  },

  // === History (Undo/Redo) ===
  saveToHistory() {
    // Remove any future states if we're not at the end
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    }
    
    // Save current state
    this.state.history.push(JSON.stringify(this.state.tasks));
    
    // Limit history size
    if (this.state.history.length > this.state.maxHistory) {
      this.state.history.shift();
    }
    
    this.state.historyIndex = this.state.history.length - 1;
    this.updateUndoRedoState();
    Storage.saveHistory(this.state.history, this.state.historyIndex);
  },

  undo() {
    if (this.state.historyIndex < 0) return;
    
    // Save current state to future if at end
    if (this.state.historyIndex === this.state.history.length - 1) {
      this.state.history.push(JSON.stringify(this.state.tasks));
    }
    
    this.state.tasks = JSON.parse(this.state.history[this.state.historyIndex]);
    this.state.historyIndex--;
    
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
    this.updateUndoRedoState();
    Storage.saveHistory(this.state.history, this.state.historyIndex);
  },

  redo() {
    if (this.state.historyIndex >= this.state.history.length - 1) return;
    
    this.state.historyIndex++;
    this.state.tasks = JSON.parse(this.state.history[this.state.historyIndex]);
    
    this.saveTasks();
    UI.renderTasks(this.state.tasks);
    this.updateUndoRedoState();
    Storage.saveHistory(this.state.history, this.state.historyIndex);
  },

  updateUndoRedoState() {
    UI.updateUndoRedoButtons(
      this.state.historyIndex >= 0,
      this.state.historyIndex < this.state.history.length - 1
    );
  },

  // === Save ===
  saveTasks() {
    Storage.saveTasks(this.state.tasks);
  },

  // === API Key ===
  saveApiKey() {
    const key = UI.getApiKeyInput();
    
    if (!Gemini.validateApiKey(key)) {
      UI.showToast('API key inválida. Deve começar com "AIza"', 'error');
      return;
    }
    
    this.state.apiKey = key;
    Storage.saveApiKey(key);
    UI.hideSettingsModal();
    UI.showToast('API key salva com sucesso! ✨', 'success');
  },

  // === Export/Import ===
  exportJSON() {
    Storage.exportJSON(this.state.tasks);
    UI.hideExportModal();
    UI.showToast('Arquivo JSON exportado!', 'success');
  },

  exportCSV() {
    Storage.exportCSV(this.state.tasks);
    UI.hideExportModal();
    UI.showToast('CSV exportado para Google Tasks!', 'success');
  },

  exportText() {
    const text = Storage.exportText(this.state.tasks);
    navigator.clipboard.writeText(text).then(() => {
      UI.hideExportModal();
      UI.showToast('Copiado para a área de transferência!', 'success');
    }).catch(() => {
      UI.showToast('Erro ao copiar', 'error');
    });
  },

  async handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const importedTasks = await Storage.importJSON(file);
      
      this.saveToHistory();
      this.state.tasks = [...importedTasks, ...this.state.tasks];
      this.saveTasks();
      UI.renderTasks(this.state.tasks);
      UI.showToast(`${importedTasks.length} tarefas importadas!`, 'success');
      
    } catch (error) {
      UI.showToast(error.message, 'error');
    }
    
    // Reset input
    e.target.value = '';
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
