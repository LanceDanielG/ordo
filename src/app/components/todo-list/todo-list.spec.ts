import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoListComponent } from './todo-list';
import { TodoStore } from '../../store/todo.store';
import { signal } from '@angular/core';

describe('TodoListComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;
    let mockTodoStore: any;

    beforeEach(async () => {
        mockTodoStore = {
            todoList: signal([]),
            inProgressList: signal([]),
            doneList: signal([]),
            todos: signal([])
        };

        await TestBed.configureTestingModule({
            imports: [TodoListComponent],
            providers: [
                { provide: TodoStore, useValue: mockTodoStore }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
