import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService).client;
    private router = inject(Router);

    user = signal<User | null>(null);
    loading = signal(true);

    constructor() {
        this.checkSession();

        this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            this.user.set(session?.user ?? null);
            this.loading.set(false);

            if (event === 'SIGNED_IN') {
                this.router.navigate(['/dashboard']);
            } else if (event === 'SIGNED_OUT') {
                this.router.navigate(['/login']);
            }
        });
    }

    async checkSession() {
        const { data: { session } } = await this.supabase.auth.getSession();
        this.user.set(session?.user ?? null);
        this.loading.set(false);
    }

    async signInWithGoogle() {
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    }

    async signInWithEmail(email: string) {
        // Supabase magic link or password-less login
        const { error } = await this.supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
    }

    async signOut() {
        await this.supabase.auth.signOut();
    }

    get isAuthenticated() {
        return !!this.user();
    }
}
