import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../store/todo.store';
import { Priority } from '../../models/todo.model';

@Component({
    selector: 'app-todo-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="input-wrapper glass-panel">
      <input 
        type="text" 
        [(ngModel)]="newTodoText" 
        (keyup.enter)="addTodo()"
        placeholder="What needs to be done?"
        class="todo-input"
      />
      
      <div class="actions">
        <select [(ngModel)]="selectedPriority" class="priority-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button class="add-btn btn-primary" (click)="addTodo()">
          Add
        </button>
      </div>
    </div>
  `,
    styles: [`
    .input-wrapper {
      padding: 1rem;
      margin-bottom: 2rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .todo-input {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.25rem;
      min-width: 200px;
    }

    .todo-input::placeholder {
      color: var(--color-text-muted);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .priority-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: white;
      border-radius: 8px;
      padding: 0 1rem;
      cursor: pointer;
    }
    
    .priority-select option {
      background: var(--color-bg-surface);
    }
  `]
})
export class TodoInputComponent {
    store = inject(TodoStore);

    newTodoText = '';
    selectedPriority: Priority = 'medium';

    addTodo() {
        if (!this.newTodoText.trim()) return;

        this.store.addTodo(this.newTodoText, this.selectedPriority);
        this.newTodoText = '';
        this.selectedPriority = 'medium';
    }
}
