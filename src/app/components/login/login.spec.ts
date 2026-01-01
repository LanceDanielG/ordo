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
            signInWithEmail: vi.fn(),
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

    it('should call signInWithEmail if email is provided', async () => {
        component.email = 'test@example.com';
        await component.loginWithEmail();
        expect(authServiceMock.signInWithEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should not call signInWithEmail if email is empty', async () => {
        component.email = '';
        await component.loginWithEmail();
        expect(authServiceMock.signInWithEmail).not.toHaveBeenCalled();
    });
});
