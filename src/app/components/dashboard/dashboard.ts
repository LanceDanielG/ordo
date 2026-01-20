import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { TodoInputComponent } from '../todo-input/todo-input';
import { TodoItemComponent } from '../todo-item/todo-item';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo, TodoCategory } from '../../models/todo.model';
import { ProjectStore } from '../../store/project.store';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserStore } from '../../store/user.store';
import { TodoListComponent } from '../todo-list/todo-list';
import { MemberManagementComponent } from '../member-management/member-management.component';
import { NotificationService } from '../../services/notification.service';
import { ToastComponent } from '../common/toast.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TodoInputComponent, DragDropModule, SidebarComponent, TodoListComponent, MemberManagementComponent, ToastComponent],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent {
    auth = inject(AuthService);
    todoStore = inject(TodoStore);
    projectStore = inject(ProjectStore);
    userStore = inject(UserStore);
    theme = inject(ThemeService);
    notification = inject(NotificationService);

    showMemberManager = signal(false);
    viewMode = signal<'board' | 'list'>('board');

    toggleMemberManager() {
        this.showMemberManager.update(v => !v);
    }

    setViewMode(mode: 'board' | 'list') {
        this.viewMode.set(mode);
    }

    addColumn() {
        this.notification.info('Custom columns coming soon!');
    }

    clearColumn(category: TodoCategory) {
        if (confirm(`Are you sure you want to clear all tasks in ${category}?`)) {
            this.todoStore.clearCategory(category);
            this.notification.success(`${category} column cleared`);
        }
    }

    get currentDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    onDrop(event: CdkDragDrop<Todo[]>, category: TodoCategory) {
        if (event.previousContainer === event.container) {
            const items = [...event.container.data];
            moveItemInArray(items, event.previousIndex, event.currentIndex);
            items.forEach((item, index) => {
                this.todoStore.moveTodo(item.id, category, index);
            });
        } else {
            const todo = event.item.data as Todo;
            this.todoStore.moveTodo(todo.id, category, event.currentIndex);
        }
    }
}
