export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    position: number;
    createdAt: number;
}
