import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Todo, Priority, TodoCategory } from '../models/todo.model';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { ProjectStore } from './project.store';

@Injectable({
    providedIn: 'root'
})
export class TodoStore {
    private supabase = inject(SupabaseService).client;
    private auth = inject(AuthService);
    private projectStore = inject(ProjectStore);

    // State
    private todosSignal = signal<Todo[]>([]);

    // Computed
    readonly todos = this.todosSignal.asReadonly();

    readonly filteredTodos = computed(() => {
        const selectedProjectId = this.projectStore.selectedProjectId();
        const allTodos = this.todosSignal();
        if (!selectedProjectId) return allTodos;
        return allTodos.filter(t => t.project_id === selectedProjectId);
    });

    readonly todoList = computed(() =>
        this.filteredTodos().filter(t => t.category === 'todo').sort((a, b) => a.position - b.position)
    );

    readonly inProgressList = computed(() =>
        this.filteredTodos().filter(t => t.category === 'in-progress').sort((a, b) => a.position - b.position)
    );

    readonly doneList = computed(() =>
        this.filteredTodos().filter(t => t.category === 'done').sort((a, b) => a.position - b.position)
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

    async addTodo(text: string, priority: Priority = 'medium', assigneeId?: string) {
        const user = this.auth.user();
        if (!user) return;

        const selectedProjectId = this.projectStore.selectedProjectId();

        const maxPos = Math.max(-1, ...this.todosSignal()
            .filter(t => t.category === 'todo' && t.project_id === selectedProjectId)
            .map(t => t.position));

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            user_id: user.id,
            text,
            completed: false,
            priority,
            category: 'todo',
            position: maxPos + 1,
            project_id: selectedProjectId || undefined,
            assignee_id: assigneeId,
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
        const isDone = toCategory === 'done';

        // Sync UI immediately
        this.todosSignal.update(todos => {
            const list = todos.map(t => {
                if (t.id === todoId) {
                    return {
                        ...t,
                        category: toCategory,
                        position: newPosition,
                        completed: isDone
                    };
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

        await this.updateTodo(todoId, {
            category: toCategory,
            position: newPosition,
            completed: isDone
        });
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

    async clearCategory(category: TodoCategory) {
        const user = this.auth.user();
        if (!user) return;

        const selectedProjectId = this.projectStore.selectedProjectId();

        // Prepare deletion query
        let query = this.supabase
            .from('todos')
            .delete()
            .eq('user_id', user.id)
            .eq('category', category);

        if (selectedProjectId) {
            query = query.eq('project_id', selectedProjectId);
        }

        const { error } = await query;

        if (!error) {
            this.todosSignal.update(todos => todos.filter(t => {
                const matchesCategory = t.category === category;
                const matchesProject = selectedProjectId ? t.project_id === selectedProjectId : true;
                return !(matchesCategory && matchesProject);
            }));
        } else {
            console.error('Error clearing category:', error);
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
