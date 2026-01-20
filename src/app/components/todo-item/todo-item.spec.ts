import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item';
import { Todo } from '../../models/todo.model';
import { TodoStore } from '../../store/todo.store';
import { ProjectStore } from '../../store/project.store';
import { UserStore } from '../../store/user.store';
import { signal } from '@angular/core';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;
    let mockStore: any;
    let mockProjectStore: any;
    let mockUserStore: any;

    const mockTodo: Todo = {
        id: '1',
        user_id: 'user1',
        text: 'Test Todo',
        completed: false,
        priority: 'medium',
        category: 'todo',
        project_id: 'project-1',
        position: 0,
        created_at: Date.now()
    };

    beforeEach(async () => {
        mockStore = {
            updateTodo: vi.fn(),
            deleteTodo: vi.fn()
        };

        mockProjectStore = {
            projects: signal([
                { id: 'project-1', name: 'Test Project', color: '#ff0000' }
            ]),
            selectedProjectId: signal(null)
        };

        mockUserStore = {
            profiles: signal([])
        };

        await TestBed.configureTestingModule({
            imports: [TodoItemComponent],
            providers: [
                { provide: TodoStore, useValue: mockStore },
                { provide: ProjectStore, useValue: mockProjectStore },
                { provide: UserStore, useValue: mockUserStore }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoItemComponent);
        component = fixture.componentInstance;
        component.todo = mockTodo;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set confirmAction to complete when onToggleRequest is called for incomplete task', () => {
        component.onToggleRequest();
        expect(component.confirmAction).toBe('complete');
    });

    it('should set confirmAction to uncomplete when onToggleRequest is called for completed task', () => {
        component.todo.completed = true;
        component.onToggleRequest();
        expect(component.confirmAction).toBe('uncomplete');
    });

    it('should set confirmAction to delete when onDeleteRequest is called', () => {
        const stopPropagationSpy = vi.fn();
        component.onDeleteRequest({ stopPropagation: stopPropagationSpy } as any);
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(component.confirmAction).toBe('delete');
    });

    it('should call store.updateTodo when onConfirm is called for complete action', () => {
        component.confirmAction = 'complete';
        component.onConfirm();
        expect(mockStore.updateTodo).toHaveBeenCalledWith('1', { completed: true, category: 'done' });
    });

    it('should call store.deleteTodo when onConfirm is called for delete action', () => {
        component.confirmAction = 'delete';
        component.onConfirm();
        expect(mockStore.deleteTodo).toHaveBeenCalledWith('1');
    });
});
