import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginComponent {
    private auth = inject(AuthService);

    email = '';
    password = '';
    isRegisterMode = signal(false);
    loading = signal(false);
    message = signal('');

    toggleMode() {
        this.isRegisterMode.update(mode => !mode);
        this.message.set('');
    }

    async loginWithGoogle() {
        try {
            await this.auth.signInWithGoogle();
        } catch (e: any) {
            console.error(e);
            this.message.set(e.message || 'Google login failed');
        }
    }

    async onSubmit() {
        if (!this.email.trim() || !this.password.trim()) return;

        this.loading.set(true);
        this.message.set('');

        try {
            if (this.isRegisterMode()) {
                await this.auth.signUpWithPassword(this.email, this.password);
                this.message.set('Registration successful! Check your email for verification.');
            } else {
                await this.auth.signInWithPassword(this.email, this.password);
                // Auth service handles navigation on SIGNED_IN event
            }
        } catch (e: any) {
            this.message.set(e.message || 'Authentication failed');
            console.error(e);
        } finally {
            this.loading.set(false);
        }
    }
}
