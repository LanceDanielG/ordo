import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoInputComponent } from './components/todo-input/todo-input';
import { TodoListComponent } from './components/todo-list/todo-list';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TodoInputComponent, TodoListComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class AppComponent {
    title = 'Ordo';

    get currentDate(): string {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}
