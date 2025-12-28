import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, Priority } from '../models/todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoStore {
    // State
    private todosSignal = signal<Todo[]>([]);

    // Computed
    readonly todos = this.todosSignal.asReadonly();

    readonly completedCount = computed(() =>
        this.todosSignal().filter(t => t.completed).length
    );

    readonly pendingCount = computed(() =>
        this.todosSignal().filter(t => !t.completed).length
    );

    constructor() {
        this.loadFromStorage();

        // Auto-save effect
        effect(() => {
            localStorage.setItem('ordo-todos', JSON.stringify(this.todosSignal()));
        });
    }

    // Actions
    addTodo(text: string, priority: Priority = 'medium') {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            priority,
            createdAt: Date.now()
        };
        this.todosSignal.update(todos => [newTodo, ...todos]);
    }

    toggleTodo(id: string) {
        this.todosSignal.update(todos =>
            todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
    }

    deleteTodo(id: string) {
        this.todosSignal.update(todos => todos.filter(t => t.id !== id));
    }

    private loadFromStorage() {
        const stored = localStorage.getItem('ordo-todos');
        if (stored) {
            try {
                this.todosSignal.set(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse todos', e);
            }
        }
    }
}
