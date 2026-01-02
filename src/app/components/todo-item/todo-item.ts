import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoStore } from '../../store/todo.store';

@Component({
    selector: 'app-todo-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo-item.html',
    styleUrl: './todo-item.scss'
})
export class TodoItemComponent {
    private store = inject(TodoStore);
    @Input({ required: true }) todo!: Todo;

    onToggle() {
        this.store.updateTodo(this.todo.id, { completed: !this.todo.completed });
    }

    onDelete(event: Event) {
        event.stopPropagation();
        this.store.deleteTodo(this.todo.id);
    }
}
