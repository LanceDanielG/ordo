import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { TodoItemComponent } from '../todo-item/todo-item';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, TodoItemComponent],
    template: `
    <div class="list-container">
      <div class="stats">
        <span>{{ store.pendingCount() }} tasks remaining</span>
        <span *ngIf="store.completedCount() > 0" class="completed-stat">
          {{ store.completedCount() }} completed
        </span>
      </div>

      <div class="list">
        <app-todo-item 
          *ngFor="let todo of store.todos()"
          [todo]="todo"
          (toggle)="store.toggleTodo($event)"
          (delete)="store.deleteTodo($event)"
        ></app-todo-item>
        
        <div *ngIf="store.todos().length === 0" class="empty-state">
          <p>No tasks yet. Add one above!</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .stats {
      display: flex;
      justify-content: space-between;
      color: var(--color-text-muted);
      margin-bottom: 1rem;
      font-size: 0.9rem;
      padding: 0 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-muted);
      font-style: italic;
    }
  `]
})
export class TodoListComponent {
    store = inject(TodoStore);
}
