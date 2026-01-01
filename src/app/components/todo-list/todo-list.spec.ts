import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoListComponent } from './todo-list';
import { TodoStore } from '../../store/todo.store';
import { signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

describe('TodoListComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;
    let mockTodoStore: any;
    let mockSupabaseService: any;

    beforeEach(async () => {
        mockTodoStore = {
            todos: signal([]),
            pendingCount: signal(0),
            completedCount: signal(0),
            toggleTodo: vi.fn(),
            deleteTodo: vi.fn(),
            reorderTodos: vi.fn()
        };

        mockSupabaseService = {
            client: {
                from: vi.fn().mockReturnThis(),
                select: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null }))
            }
        };

        await TestBed.configureTestingModule({
            imports: [TodoListComponent],
            providers: [
                { provide: TodoStore, useValue: mockTodoStore },
                { provide: SupabaseService, useValue: mockSupabaseService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list todos when available', () => {
        mockTodoStore.todos.set([
            { id: '1', user_id: 'u1', text: 'Todo 1', completed: false, priority: 'medium', position: 0, createdAt: Date.now() }
        ]);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-todo-item')).toBeTruthy();
    });
});
