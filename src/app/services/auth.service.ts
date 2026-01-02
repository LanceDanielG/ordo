import { Injectable, signal, inject, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService).client;
    private router = inject(Router);
    private zone = inject(NgZone);

    user = signal<User | null>(null);
    loading = signal(true);

    constructor() {
        this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            console.log('Auth event:', event, session?.user?.email);

            this.zone.run(() => {
                this.user.set(session?.user ?? null);
                this.loading.set(false);

                if (event === 'SIGNED_IN') {
                    this.router.navigate(['/dashboard']);
                } else if (event === 'SIGNED_OUT') {
                    this.router.navigate(['/login']);
                }
            });
        });

        this.checkSession();
    }

    async checkSession() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            this.zone.run(() => {
                this.user.set(session?.user ?? null);
                this.loading.set(false);
            });
        } catch (error) {
            this.zone.run(() => {
                this.loading.set(false);
            });
        }
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

    async signInWithPassword(email: string, password: string) {
        const { error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
    }

    async signUpWithPassword(email: string, password: string) {
        const { error } = await this.supabase.auth.signUp({
            email,
            password,
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
