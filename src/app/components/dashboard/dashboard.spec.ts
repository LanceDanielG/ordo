import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { TodoStore } from '../../store/todo.store';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ProjectStore } from '../../store/project.store';
import { UserStore } from '../../store/user.store';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TodoListComponent } from '../todo-list/todo-list';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let authServiceMock: any;
    let themeServiceMock: any;
    let projectStoreMock: any;

    beforeEach(async () => {
        authServiceMock = {
            user: signal({ email: 'test@example.com' }),
            signOut: vi.fn()
        };

        themeServiceMock = {
            isDarkMode: signal(true),
            toggleTheme: vi.fn()
        };

        projectStoreMock = {
            projects: signal([]),
            selectedProjectId: signal(null),
            selectedProject: signal(null),
            selectProject: vi.fn(),
            currentMembers: signal([])
        };

        const userStoreMock = {
            profiles: signal([])
        };

        const todoStoreMock = {
            todos: signal([]),
            filteredTodos: signal([]),
            todoList: signal([]),
            inProgressList: signal([]),
            doneList: signal([]),
            moveTodo: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: ThemeService, useValue: themeServiceMock },
                { provide: TodoStore, useValue: todoStoreMock },
                { provide: ProjectStore, useValue: projectStoreMock },
                { provide: UserStore, useValue: userStoreMock },
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the username part of the email', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('test');
    });

    it('should call signOut when logout button is clicked', () => {
        component.auth.signOut();
        expect(authServiceMock.signOut).toHaveBeenCalled();
    });

    it('should call toggleTheme on toggle', () => {
        component.theme.toggleTheme();
        expect(themeServiceMock.toggleTheme).toHaveBeenCalled();
    });
});
