import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
    selector: 'app-todo-item',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="todo-item glass-panel" [class.completed]="todo.completed">
      <div class="checkbox-wrapper" (click)="onToggle()">
        <div class="custom-checkbox" [class.checked]="todo.completed">
          <span *ngIf="todo.completed">✓</span>
        </div>
      </div>
      
      <div class="content">
        <span class="text">{{ todo.text }}</span>
        <span class="priority-badge" [class]="todo.priority">{{ todo.priority }}</span>
      </div>

      <button class="delete-btn" (click)="onDelete($event)">
        ×
      </button>
    </div>
  `,
    styles: [`
    .todo-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.75rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .todo-item:hover {
      background: rgba(255, 255, 255, 0.05); /* slightly lighter */
    }

    .todo-item.completed .text {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .checkbox-wrapper {
      margin-right: 1rem;
    }

    .custom-checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid var(--color-primary);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: 0.2s;
    }

    .custom-checkbox.checked {
      background: var(--color-primary);
    }

    .content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .text {
      font-size: 1.1rem;
    }

    .priority-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 0.05em;
    }

    .priority-badge.high { background: rgba(239, 68, 68, 0.2); color: var(--color-danger); }
    .priority-badge.medium { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .priority-badge.low { background: rgba(34, 197, 94, 0.2); color: var(--color-success); }

    .delete-btn {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 0.5rem;
      opacity: 0;
      transition: 0.2s;
    }

    .todo-item:hover .delete-btn {
      opacity: 1;
    }

    .delete-btn:hover {
      color: var(--color-danger);
    }
  `]
})
export class TodoItemComponent {
    @Input({ required: true }) todo!: Todo;
    @Output() toggle = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();

    onToggle() {
        this.toggle.emit(this.todo.id);
    }

    onDelete(event: Event) {
        event.stopPropagation();
        this.delete.emit(this.todo.id);
    }
}
