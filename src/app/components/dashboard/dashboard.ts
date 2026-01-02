import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { TodoInputComponent } from '../todo-input/todo-input';
import { TodoItemComponent } from '../todo-item/todo-item';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Todo, TodoCategory } from '../../models/todo.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TodoInputComponent, TodoItemComponent, DragDropModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent {
    auth = inject(AuthService);
    store = inject(TodoStore);
    theme = inject(ThemeService);

    get currentDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    onDrop(event: CdkDragDrop<Todo[]>, category: TodoCategory) {
        if (event.previousContainer === event.container) {
            // Reordering in same column
            const items = [...event.container.data];
            moveItemInArray(items, event.previousIndex, event.currentIndex);
            // Reorder positions (simplified for now)
            items.forEach((item, index) => {
                this.store.moveTodo(item.id, category, index);
            });
        } else {
            // Transferring between columns
            const todo = event.item.data as Todo;
            this.store.moveTodo(todo.id, category, event.currentIndex);
        }
    }
}
