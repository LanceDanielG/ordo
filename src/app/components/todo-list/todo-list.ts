import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { TodoItemComponent } from '../todo-item/todo-item';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    template: `<!-- Deprecated in favor of Dashboard Board View -->`,
    styles: []
})
export class TodoListComponent {
    store = inject(TodoStore);
}
