import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item';
import { Todo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;

    const mockTodo: Todo = {
        id: '1',
        user_id: 'user1',
        text: 'Test Todo',
        completed: false,
        priority: 'medium',
        position: 0,
        createdAt: Date.now()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoItemComponent);
        component = fixture.componentInstance;
        component.todo = mockTodo;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit toggle event when onToggle is called', () => {
        vi.spyOn(component.toggle, 'emit');
        component.onToggle();
        expect(component.toggle.emit).toHaveBeenCalledWith('1');
    });

    it('should emit delete event when onDelete is called', () => {
        vi.spyOn(component.delete, 'emit');
        const stopPropagationSpy = vi.fn();
        component.onDelete({ stopPropagation: stopPropagationSpy } as any);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(component.delete.emit).toHaveBeenCalledWith('1');
    });
});
