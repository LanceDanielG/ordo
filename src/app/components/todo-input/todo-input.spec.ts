import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoInputComponent } from './todo-input';
import { TodoStore } from '../../store/todo.store';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

describe('TodoInputComponent', () => {
    let component: TodoInputComponent;
    let fixture: ComponentFixture<TodoInputComponent>;
    let mockTodoStore: any;
    let mockSupabaseService: any;

    beforeEach(async () => {
        mockTodoStore = {
            addTodo: vi.fn()
        };
        mockSupabaseService = {
            client: {
                from: vi.fn().mockReturnThis(),
                select: vi.fn().mockImplementation(() => Promise.resolve({ data: [], error: null }))
            }
        };

        await TestBed.configureTestingModule({
            imports: [TodoInputComponent, FormsModule],
            providers: [
                { provide: TodoStore, useValue: mockTodoStore },
                { provide: SupabaseService, useValue: mockSupabaseService }
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

        expect(mockTodoStore.addTodo).toHaveBeenCalledWith('New Todo', 'high');
        expect(component.newTodoText).toBe('');
        expect(component.selectedPriority).toBe('medium');
    });
});
