import { Injectable, signal, inject, effect } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { Profile } from '../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class UserStore {
    private supabase = inject(SupabaseService).client;
    private auth = inject(AuthService);

    // State
    private profilesSignal = signal<Profile[]>([]);

    // Computed
    readonly profiles = this.profilesSignal.asReadonly();

    constructor() {
        effect(() => {
            const user = this.auth.user();
            if (user) {
                this.loadAllProfiles();
            } else {
                this.profilesSignal.set([]);
            }
        });
    }

    private async loadAllProfiles() {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (!error && data) {
            this.profilesSignal.set(data as Profile[]);
        } else if (error) {
            console.error('Error loading profiles:', error);
        }
    }

    async getProfile(id: string): Promise<Profile | null> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Profile;
    }
}
