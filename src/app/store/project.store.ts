import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Project } from '../models/project.model';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectStore {
    private supabase = inject(SupabaseService).client;
    private auth = inject(AuthService);

    // State
    private projectsSignal = signal<Project[]>([]);
    private selectedProjectIdSignal = signal<string | null>(null);
    private membersSignal = signal<Record<string, any[]>>({}); // project_id -> members

    // Computed
    readonly projects = this.projectsSignal.asReadonly();
    readonly selectedProjectId = this.selectedProjectIdSignal.asReadonly();

    readonly selectedProject = computed(() =>
        this.projectsSignal().find(p => p.id === this.selectedProjectIdSignal()) || null
    );

    readonly currentMembers = computed(() => {
        const pid = this.selectedProjectIdSignal();
        return pid ? (this.membersSignal()[pid] || []) : [];
    });

    constructor() {
        effect(() => {
            const user = this.auth.user();
            if (user) {
                this.loadFromSupabase(user.id);
            } else {
                this.projectsSignal.set([]);
                this.selectedProjectIdSignal.set(null);
            }
        });
    }

    selectProject(id: string | null) {
        this.selectedProjectIdSignal.set(id);
    }

    async addProject(name: string, color: string = '#06b6d4', description?: string) {
        const user = this.auth.user();
        if (!user) return;

        const newProject: Project = {
            id: crypto.randomUUID(),
            user_id: user.id,
            name,
            description,
            color,
            created_at: new Date().toISOString()
        };

        const { error } = await this.supabase
            .from('projects')
            .insert(newProject);

        if (!error) {
            this.projectsSignal.update(projects => [...projects, newProject]);
        } else {
            console.error('Error adding project:', error);
        }
    }

    async updateProject(id: string, updates: Partial<Project>) {
        const user = this.auth.user();
        if (!user) return;

        const { error } = await this.supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);

        if (!error) {
            this.projectsSignal.update(projects =>
                projects.map(p => p.id === id ? { ...p, ...updates } : p)
            );
        }
    }

    async deleteProject(id: string) {
        const user = this.auth.user();
        if (!user) return;

        const { error } = await this.supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (!error) {
            this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
            if (this.selectedProjectIdSignal() === id) {
                this.selectedProjectIdSignal.set(null);
            }
        }
    }

    private async loadFromSupabase(userId: string) {
        const { data, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            this.projectsSignal.set(data as Project[]);
            // Load members for each project
            data.forEach(p => this.loadMembers(p.id));
        }
    }

    private async loadMembers(projectId: string) {
        const { data, error } = await this.supabase
            .from('project_members')
            .select('*, profiles(*)')
            .eq('project_id', projectId);

        if (!error && data) {
            this.membersSignal.update(m => ({ ...m, [projectId]: data }));
        }
    }

    async addMember(projectId: string, email: string) {
        // First find user by email
        const { data: userData, error: userError } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !userData) {
            throw new Error('User not found');
        }

        const { error } = await this.supabase
            .from('project_members')
            .insert({ project_id: projectId, user_id: userData.id });

        if (!error) {
            this.loadMembers(projectId);
        } else {
            throw error;
        }
    }
}
