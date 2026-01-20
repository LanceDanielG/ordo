import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoInputComponent } from './todo-input';
import { TodoStore } from '../../store/todo.store';
import { ProjectStore } from '../../store/project.store';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { SidebarComponent } from '../sidebar/sidebar.component';

describe('TodoInputComponent', () => {
    let component: TodoInputComponent;
    let fixture: ComponentFixture<TodoInputComponent>;
    let mockTodoStore: any;
    let mockProjectStore: any;

    beforeEach(async () => {
        mockTodoStore = {
            addTodo: vi.fn()
        };
        mockProjectStore = {
            projects: signal([]),
            selectedProjectId: signal(null),
            currentMembers: signal([])
        };
        const mockUserStore = {
            profiles: signal([])
        };

        await TestBed.configureTestingModule({
            imports: [TodoInputComponent, FormsModule],
            providers: [
                { provide: TodoStore, useValue: mockTodoStore },
                { provide: ProjectStore, useValue: mockProjectStore },
                { provide: UserStore, useValue: mockUserStore }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not add todo if text is empty', () => {
        component.newTodoText = '   ';
        component.addTodo();
        expect(mockTodoStore.addTodo).not.toHaveBeenCalled();
    });

    it('should add todo and clear input', () => {
        component.newTodoText = 'New Todo';
        component.selectedPriority = 'high';
        component.addTodo();

        expect(mockTodoStore.addTodo).toHaveBeenCalledWith('New Todo', 'high', undefined);
        expect(component.newTodoText).toBe('');
        expect(component.selectedPriority).toBe('medium');
    });
});
