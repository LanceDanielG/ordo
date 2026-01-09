import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = environment.supabaseUrl;
        const supabaseKey = environment.supabaseKey;

        // Check if we are running in a test environment (Vitest)
        const isTest = (globalThis as any).process?.env?.NODE_ENV === 'test';

        this.supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: !isTest,
                autoRefreshToken: !isTest,
                detectSessionInUrl: !isTest
            }
        });

        // Connection Check
        this.supabase.from('todos').select('id', { count: 'exact', head: true })
            .then(({ error }) => {
                if (error) {
                    console.error('Supabase connection error:', error.message);
                } else {
                    console.log('✅ Supabase connected successfully!');
                }
            });
    }

    get client() {
        return this.supabase;
    }
}
