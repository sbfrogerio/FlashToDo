/**
 * Storage Module - LocalStorage + Export/Import
 */

const Storage = {
  KEYS: {
    TASKS: 'smart-todo-tasks',
    API_KEY: 'smart-todo-api-key',
    HISTORY: 'smart-todo-history'
  },

  // === Tasks ===
  saveTasks(tasks) {
    try {
      localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Failed to save tasks:', e);
      return false;
    }
  },

  loadTasks() {
    try {
      const data = localStorage.getItem(this.KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return [];
    }
  },

  // === API Key ===
  saveApiKey(key) {
    try {
      localStorage.setItem(this.KEYS.API_KEY, key);
      return true;
    } catch (e) {
      console.error('Failed to save API key:', e);
      return false;
    }
  },

  loadApiKey() {
    return localStorage.getItem(this.KEYS.API_KEY) || null;
  },

  // === History (for Undo/Redo) ===
  saveHistory(history, index) {
    try {
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify({ history, index }));
      return true;
    } catch (e) {
      console.error('Failed to save history:', e);
      return false;
    }
  },

  loadHistory() {
    try {
      const data = localStorage.getItem(this.KEYS.HISTORY);
      return data ? JSON.parse(data) : { history: [], index: -1 };
    } catch (e) {
      return { history: [], index: -1 };
    }
  },

  // === Export Functions ===
  exportJSON(tasks) {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: tasks
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-todo-backup-${this.formatDate(new Date())}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  },

  exportCSV(tasks) {
    // Flatten tasks for Google Tasks import
    const rows = [];
    
    const flattenTasks = (taskList, parentTitle = '') => {
      taskList.forEach(task => {
        const title = parentTitle ? `${parentTitle} > ${task.text}` : task.text;
        rows.push({
          title: title,
          completed: task.completed ? 'TRUE' : 'FALSE'
        });
        
        if (task.subtasks && task.subtasks.length > 0) {
          flattenTasks(task.subtasks, task.text);
        }
      });
    };
    
    flattenTasks(tasks);
    
    // Create CSV
    const csvContent = 'Title,Status\n' + 
      rows.map(row => `"${row.title.replace(/"/g, '""')}",${row.completed}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-todo-${this.formatDate(new Date())}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
  },

  exportText(tasks) {
    const lines = [];
    
    const formatTasks = (taskList, indent = 0) => {
      taskList.forEach(task => {
        const prefix = '  '.repeat(indent);
        const checkbox = task.completed ? '✅' : '⬜';
        lines.push(`${prefix}${checkbox} ${task.text}`);
        
        if (task.subtasks && task.subtasks.length > 0) {
          formatTasks(task.subtasks, indent + 1);
        }
      });
    };
    
    formatTasks(tasks);
    return lines.join('\n');
  },

  // === Import ===
  async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data.tasks && Array.isArray(data.tasks)) {
            resolve(data.tasks);
          } else if (Array.isArray(data)) {
            resolve(data);
          } else {
            reject(new Error('Formato de arquivo inválido'));
          }
        } catch (err) {
          reject(new Error('Erro ao processar arquivo JSON'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  },

  // === Helpers ===
  formatDate(date) {
    return date.toISOString().split('T')[0];
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};
