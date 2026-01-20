import { Component, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { TodoItemComponent } from '../todo-item/todo-item';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TodoCategory, Todo } from '../../models/todo.model';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, DragDropModule, TodoItemComponent],
    templateUrl: './todo-list.html',
    styles: []
})
export class TodoListComponent {
    store = inject(TodoStore);
    @Input() category: TodoCategory = 'todo';

    filteredTodos = computed(() => {
        switch (this.category) {
            case 'todo': return this.store.todoList();
            case 'in-progress': return this.store.inProgressList();
            case 'done': return this.store.doneList();
            default: return [];
        }
    });

    drop(event: CdkDragDrop<Todo[]>) {
        if (event.previousContainer === event.container) {
            // Reordering in same list is handled in store
            this.store.moveTodo(event.item.data.id, this.category, event.currentIndex);
        } else {
            // Moving between lists
            this.store.moveTodo(event.item.data.id, this.category, event.currentIndex);
        }
    }
}
