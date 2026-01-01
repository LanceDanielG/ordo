import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Todo, Priority } from '../models/todo.model';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class TodoStore {
    private supabase = inject(SupabaseService).client;
    private auth = inject(AuthService);

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
        // Automatically load when user changes
        effect(() => {
            const user = this.auth.user();
            if (user) {
                this.loadFromSupabase(user.id);
            } else {
                this.todosSignal.set([]);
            }
        });
    }

    // Actions
    async addTodo(text: string, priority: Priority = 'medium') {
        const user = this.auth.user();
        if (!user) return;

        const maxPos = Math.max(0, ...this.todosSignal().map(t => t.position));

        const newTodo: Partial<Todo> = {
            id: crypto.randomUUID(),
            user_id: user.id,
            text,
            completed: false,
            priority,
            position: maxPos + 1,
            createdAt: Date.now()
        };

        const { error } = await this.supabase
            .from('todos')
            .insert(newTodo);

        if (!error) {
            this.todosSignal.update(todos => [newTodo as Todo, ...todos]);
        } else {
            console.error('Error adding todo:', error);
        }
    }

    async toggleTodo(id: string) {
        const todo = this.todosSignal().find(t => t.id === id);
        if (!todo) return;

        const { error } = await this.supabase
            .from('todos')
            .update({ completed: !todo.completed })
            .eq('id', id);

        if (!error) {
            this.todosSignal.update(todos =>
                todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            );
        } else {
            console.error('Error toggling todo:', error);
        }
    }

    async deleteTodo(id: string) {
        const { error } = await this.supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (!error) {
            this.todosSignal.update(todos => todos.filter(t => t.id !== id));
        } else {
            console.error('Error deleting todo:', error);
        }
    }

    async reorderTodos(newOrder: Todo[]) {
        const updatedTodos = newOrder.map((todo, index) => ({
            ...todo,
            position: index
        }));

        this.todosSignal.set(updatedTodos);

        // Batch update positions in Supabase
        for (const todo of updatedTodos) {
            await this.supabase
                .from('todos')
                .update({ position: todo.position })
                .eq('id', todo.id);
        }
    }

    private async loadFromSupabase(userId: string) {
        const { data, error } = await this.supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId)
            .order('position', { ascending: true });

        if (!error && data) {
            this.todosSignal.set(data as Todo[]);
        } else if (error) {
            console.error('Error loading todos:', error);
        }
    }
}
