import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Todo } from '../../models/todo.model';
import { TodoStore } from '../../store/todo.store';
import { ProjectStore } from '../../store/project.store';
import { UserStore } from '../../store/user.store';

@Component({
    selector: 'app-todo-item',
    standalone: true,
    imports: [CommonModule, FormsModule, CdkDrag],
    templateUrl: './todo-item.html',
    styleUrl: './todo-item.scss'
})
export class TodoItemComponent {
    store = inject(TodoStore);
    projectStore = inject(ProjectStore);
    userStore = inject(UserStore);
    @Input({ required: true }) todo!: Todo;

    get project() {
        return this.projectStore.projects().find(p => p.id === this.todo.project_id);
    }

    get assignee() {
        return this.userStore.profiles().find(p => p.id === this.todo.assignee_id);
    }

    moveToProject(projectId: string | null) {
        this.store.updateTodo(this.todo.id, { project_id: projectId || undefined });
    }

    confirmAction: 'complete' | 'uncomplete' | 'delete' | null = null;

    get confirmTitle(): string {
        switch (this.confirmAction) {
            case 'complete': return 'Mark as Done';
            case 'uncomplete': return 'Mark as Pending';
            case 'delete': return 'Delete Task';
            default: return '';
        }
    }

    get confirmMessage(): string {
        switch (this.confirmAction) {
            case 'complete': return 'Are you sure you want to mark this task as completed? It will be moved to the Done column.';
            case 'uncomplete': return 'Are you sure you want to mark this task as pending? It will be moved to the In Progress column.';
            case 'delete': return 'Are you sure you want to delete this task? This action cannot be undone.';
            default: return '';
        }
    }

    onToggleRequest() {
        if (!this.todo.completed) {
            this.confirmAction = 'complete';
        } else {
            this.confirmAction = 'uncomplete';
        }
    }

    onDeleteRequest(event: Event) {
        event.stopPropagation();
        this.confirmAction = 'delete';
    }

    onConfirm() {
        const action = this.confirmAction;
        this.confirmAction = null;

        if (action === 'complete') {
            this.store.updateTodo(this.todo.id, { completed: true, category: 'done' });
        } else if (action === 'uncomplete') {
            this.store.updateTodo(this.todo.id, { completed: false, category: 'in-progress' });
        } else if (action === 'delete') {
            this.store.deleteTodo(this.todo.id);
        }
    }

    onCancel() {
        this.confirmAction = null;
    }
}
