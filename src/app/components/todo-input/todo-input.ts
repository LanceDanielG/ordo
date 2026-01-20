import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../store/todo.store';
import { Priority } from '../../models/todo.model';
import { ProjectStore } from '../../store/project.store';
import { UserStore } from '../../store/user.store';

@Component({
    selector: 'app-todo-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './todo-input.html',
    styleUrl: './todo-input.scss'
})
export class TodoInputComponent {
    todoStore = inject(TodoStore);
    projectStore = inject(ProjectStore);
    userStore = inject(UserStore);

    newTodoText = '';
    selectedPriority: Priority = 'medium';
    selectedProjectId = signal<string | null>(null);
    selectedAssigneeId = signal<string | null>(null);

    constructor() {
        effect(() => {
            this.selectedProjectId.set(this.projectStore.selectedProjectId());
        });
    }

    addTodo() {
        if (this.newTodoText.trim()) {
            this.todoStore.addTodo(
                this.newTodoText,
                this.selectedPriority,
                this.selectedAssigneeId() || undefined
            );
            this.newTodoText = '';
            this.selectedPriority = 'medium';
            this.selectedAssigneeId.set(null);
        }
    }
}
