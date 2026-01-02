import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Todo, Priority, TodoCategory } from '../models/todo.model';
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

    readonly todoList = computed(() =>
        this.todosSignal().filter(t => t.category === 'todo').sort((a, b) => a.position - b.position)
    );

    readonly inProgressList = computed(() =>
        this.todosSignal().filter(t => t.category === 'in-progress').sort((a, b) => a.position - b.position)
    );

    readonly doneList = computed(() =>
        this.todosSignal().filter(t => t.category === 'done').sort((a, b) => a.position - b.position)
    );

    constructor() {
        effect(() => {
            const user = this.auth.user();
            if (user) {
                this.loadFromSupabase(user.id);
            } else {
                this.todosSignal.set([]);
            }
        });
    }

    async addTodo(text: string, priority: Priority = 'medium') {
        const user = this.auth.user();
        if (!user) return;

        const maxPos = Math.max(-1, ...this.todosSignal()
            .filter(t => t.category === 'todo')
            .map(t => t.position));

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            user_id: user.id,
            text,
            completed: false,
            priority,
            category: 'todo',
            position: maxPos + 1,
            created_at: new Date().toISOString()
        };

        const { error } = await this.supabase
            .from('todos')
            .insert(newTodo);

        if (!error) {
            this.todosSignal.update(todos => [...todos, newTodo]);
        } else {
            console.error('Error adding todo:', error);
        }
    }

    async updateTodo(id: string, updates: Partial<Todo>) {
        const user = this.auth.user();
        if (!user) return;

        const { error } = await this.supabase
            .from('todos')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);

        if (!error) {
            this.todosSignal.update(todos =>
                todos.map(t => t.id === id ? { ...t, ...updates } : t)
            );
        }
    }

    async moveTodo(todoId: string, toCategory: TodoCategory, newPosition: number) {
        // Sync UI immediately
        this.todosSignal.update(todos => {
            const list = todos.map(t => {
                if (t.id === todoId) {
                    return { ...t, category: toCategory, position: newPosition };
                }
                return t;
            });

            // Re-calculate positions for the target category to avoid gaps
            const categoryTodos = list
                .filter(t => t.category === toCategory)
                .sort((a, b) => {
                    if (a.id === todoId) return newPosition - b.position;
                    return a.position - b.position;
                });

            // This is simplified; real drag/drop needs more complex position math
            // but for now we'll just update the target todo
            return list;
        });

        await this.updateTodo(todoId, { category: toCategory, position: newPosition });
    }

    async deleteTodo(id: string) {
        const user = this.auth.user();
        if (!user) return;

        const { error } = await this.supabase
            .from('todos')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (!error) {
            this.todosSignal.update(todos => todos.filter(t => t.id !== id));
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
        }
    }
}
