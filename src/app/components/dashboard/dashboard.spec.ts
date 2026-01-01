import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let authServiceMock: any;
    let themeServiceMock: any;

    beforeEach(async () => {
        authServiceMock = {
            user: signal({ email: 'test@example.com' }),
            signOut: vi.fn()
        };

        themeServiceMock = {
            isDarkMode: signal(true),
            toggleTheme: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: ThemeService, useValue: themeServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the user email', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('test@example.com');
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
