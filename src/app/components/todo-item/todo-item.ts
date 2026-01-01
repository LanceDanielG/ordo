import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
    selector: 'app-todo-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo-item.html',
    styleUrl: './todo-item.scss'
})
export class TodoItemComponent {
    @Input({ required: true }) todo!: Todo;
    @Output() toggle = new EventEmitter<string>();
    @Output() delete = new EventEmitter<string>();

    onToggle() {
        this.toggle.emit(this.todo.id);
    }

    onDelete(event: Event) {
        event.stopPropagation();
        this.delete.emit(this.todo.id);
    }
}
