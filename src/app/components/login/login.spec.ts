import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: any;

    beforeEach(async () => {
        authServiceMock = {
            signInWithGoogle: vi.fn(),
            signInWithPassword: vi.fn(),
            signUpWithPassword: vi.fn(),
            user: signal(null),
            loading: signal(false)
        };

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call signInWithGoogle', async () => {
        await component.loginWithGoogle();
        expect(authServiceMock.signInWithGoogle).toHaveBeenCalled();
    });

    it('should call signInWithPassword on submit in login mode', async () => {
        component.email = 'test@example.com';
        component.password = 'password123';
        component.isRegisterMode.set(false);
        await component.onSubmit();
        expect(authServiceMock.signInWithPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should call signUpWithPassword on submit in register mode', async () => {
        component.email = 'test@example.com';
        component.password = 'password123';
        component.isRegisterMode.set(true);
        await component.onSubmit();
        expect(authServiceMock.signUpWithPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should toggle register mode', () => {
        expect(component.isRegisterMode()).toBe(false);
        component.toggleMode();
        expect(component.isRegisterMode()).toBe(true);
        component.toggleMode();
        expect(component.isRegisterMode()).toBe(false);
    });
});
