import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../store/todo.store';
import { Priority } from '../../models/todo.model';

@Component({
    selector: 'app-todo-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './todo-input.html',
    styleUrl: './todo-input.scss'
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
