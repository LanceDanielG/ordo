export type Priority = 'low' | 'medium' | 'high';
export type TodoCategory = 'todo' | 'in-progress' | 'done';

export interface Todo {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    category: TodoCategory;
    position: number;
    created_at: number | string;
}
