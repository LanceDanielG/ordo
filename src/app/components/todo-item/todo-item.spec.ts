import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item';
import { Todo } from '../../models/todo.model';
import { TodoStore } from '../../store/todo.store';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;
    let mockStore: any;

    const mockTodo: Todo = {
        id: '1',
        user_id: 'user1',
        text: 'Test Todo',
        completed: false,
        priority: 'medium',
        category: 'todo',
        position: 0,
        created_at: Date.now()
    };

    beforeEach(async () => {
        mockStore = {
            updateTodo: vi.fn(),
            deleteTodo: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [TodoItemComponent],
            providers: [{ provide: TodoStore, useValue: mockStore }]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoItemComponent);
        component = fixture.componentInstance;
        component.todo = mockTodo;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call store.updateTodo when onToggle is called', () => {
        component.onToggle();
        expect(mockStore.updateTodo).toHaveBeenCalledWith('1', { completed: true });
    });

    it('should call store.deleteTodo when onDelete is called', () => {
        const stopPropagationSpy = vi.fn();
        component.onDelete({ stopPropagation: stopPropagationSpy } as any);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(mockStore.deleteTodo).toHaveBeenCalledWith('1');
    });
});
