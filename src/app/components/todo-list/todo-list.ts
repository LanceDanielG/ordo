import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { TodoItemComponent } from '../todo-item/todo-item';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, TodoItemComponent, DragDropModule],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.scss'
})
export class TodoListComponent {
    store = inject(TodoStore);

    drop(event: CdkDragDrop<string[]>) {
        const todos = [...this.store.todos()];
        moveItemInArray(todos, event.previousIndex, event.currentIndex);
        this.store.reorderTodos(todos);
    }
}
