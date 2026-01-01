import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from '../todo-input/todo-input';
import { TodoListComponent } from '../todo-list/todo-list';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TodoInputComponent, TodoListComponent],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent {
    auth = inject(AuthService);
    theme = inject(ThemeService);

    get currentDate(): string {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}
