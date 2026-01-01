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
    loading = signal(false);
    message = signal('');

    async loginWithGoogle() {
        try {
            await this.auth.signInWithGoogle();
        } catch (e: any) {
            console.error(e);
        }
    }

    async loginWithEmail() {
        if (!this.email.trim()) return;

        this.loading.set(true);
        try {
            await this.auth.signInWithEmail(this.email);
            this.message.set('Check your email for the magic link!');
        } catch (e: any) {
            this.message.set('Error sending email. Please try again.');
            console.error(e);
        } finally {
            this.loading.set(false);
        }
    }
}
