/**
 * UI Module - Rendering and Event Handling
 */

const UI = {
  elements: {},

  init() {
    // Cache DOM elements
    this.elements = {
      goalInput: document.getElementById('goal-input'),
      magicBtn: document.getElementById('magic-btn'),
      tasksList: document.getElementById('tasks-list'),
      tasksHeader: document.getElementById('tasks-header'),
      emptyState: document.getElementById('empty-state'),
      
      // Buttons
      settingsBtn: document.getElementById('settings-btn'),
      importBtn: document.getElementById('import-btn'),
      exportBtn: document.getElementById('export-btn'),
      undoBtn: document.getElementById('undo-btn'),
      redoBtn: document.getElementById('redo-btn'),
      clearCompletedBtn: document.getElementById('clear-completed-btn'),
      
      // Settings Modal
      settingsModal: document.getElementById('settings-modal'),
      settingsClose: document.getElementById('settings-close'),
      settingsCancel: document.getElementById('settings-cancel'),
      settingsSave: document.getElementById('settings-save'),
      apiKeyInput: document.getElementById('api-key-input'),
      
      // Export Modal
      exportModal: document.getElementById('export-modal'),
      exportClose: document.getElementById('export-close'),
      exportJSON: document.getElementById('export-json'),
      exportCSV: document.getElementById('export-csv'),
      exportText: document.getElementById('export-text'),
      
      // Import
      importInput: document.getElementById('import-input'),
      
      // Toast
      toastContainer: document.getElementById('toast-container')
    };
  },

  // === Task Rendering ===
  renderTasks(tasks) {
    const hasTask = tasks.length > 0;
    
    // Toggle visibility
    this.elements.tasksHeader.style.display = hasTask ? 'flex' : 'none';
    this.elements.emptyState.style.display = hasTask ? 'none' : 'flex';
    
    // Clear and render
    this.elements.tasksList.innerHTML = '';
    
    tasks.forEach((task, index) => {
      const taskEl = this.createTaskElement(task, index);
      this.elements.tasksList.appendChild(taskEl);
    });
  },

  createTaskElement(task, index) {
    const div = document.createElement('div');
    div.className = `task-item${task.completed ? ' is-completed' : ''}`;
    div.dataset.id = task.id;
    div.draggable = true;
    
    div.innerHTML = `
      <div class="task-item__main">
        <div class="task-item__drag" title="Arrastar para reordenar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5"/>
            <circle cx="15" cy="5" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/>
            <circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="19" r="1.5"/>
            <circle cx="15" cy="19" r="1.5"/>
          </svg>
        </div>
        
        <label class="task-item__checkbox">
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-item__checkbox-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </label>
        
        <div class="task-item__content">
          <span class="task-item__text">${this.escapeHtml(task.text)}</span>
        </div>
        
        <div class="task-item__actions">
          <button class="task-item__btn task-item__btn--magic" title="Quebrar em subtarefas" data-action="breakdown">
            ✨
          </button>
          <button class="task-item__btn task-item__btn--delete" title="Excluir" data-action="delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      
      ${task.subtasks && task.subtasks.length > 0 ? `
        <div class="task-item__subtasks">
          ${task.subtasks.map(sub => this.createSubtaskHTML(sub)).join('')}
        </div>
      ` : ''}
    `;
    
    return div;
  },

  createSubtaskHTML(subtask) {
    return `
      <div class="subtask-item${subtask.completed ? ' is-completed' : ''}" data-id="${subtask.id}">
        <label class="task-item__checkbox">
          <input type="checkbox" ${subtask.completed ? 'checked' : ''}>
          <span class="task-item__checkbox-visual">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </label>
        
        <span class="subtask-item__text">${this.escapeHtml(subtask.text)}</span>
        
        <div class="subtask-item__actions">
          <button class="task-item__btn task-item__btn--magic" title="Quebrar mais" data-action="breakdown">
            ✨
          </button>
          <button class="task-item__btn task-item__btn--delete" title="Excluir" data-action="delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  },

  // === Loading State ===
  setLoading(isLoading) {
    const btn = this.elements.magicBtn;
    
    if (isLoading) {
      btn.classList.add('is-loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }
  },

  setTaskLoading(taskId, isLoading) {
    const taskEl = document.querySelector(`[data-id="${taskId}"]`);
    if (!taskEl) return;
    
    const magicBtn = taskEl.querySelector('[data-action="breakdown"]');
    if (magicBtn) {
      magicBtn.disabled = isLoading;
      magicBtn.textContent = isLoading ? '⏳' : '✨';
    }
  },

  // === Undo/Redo Buttons ===
  updateUndoRedoButtons(canUndo, canRedo) {
    this.elements.undoBtn.disabled = !canUndo;
    this.elements.redoBtn.disabled = !canRedo;
  },

  // === Modals ===
  showSettingsModal(currentKey = '') {
    this.elements.apiKeyInput.value = currentKey || '';
    this.elements.settingsModal.showModal();
  },

  hideSettingsModal() {
    this.elements.settingsModal.close();
  },

  showExportModal() {
    this.elements.exportModal.showModal();
  },

  hideExportModal() {
    this.elements.exportModal.close();
  },

  // === Toast Notifications ===
  showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    this.elements.toastContainer.appendChild(toast);
    
    // Auto remove after 3s
    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  },

  // === Helpers ===
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getGoalInput() {
    return this.elements.goalInput.value.trim();
  },

  clearGoalInput() {
    this.elements.goalInput.value = '';
  },

  getApiKeyInput() {
    return this.elements.apiKeyInput.value.trim();
  }
};
