import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectStore } from '../../store/project.store';

@Component({
    selector: 'app-member-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './member-management.component.html',
    styleUrl: './member-management.component.scss'
})
export class MemberManagementComponent {
    projectStore = inject(ProjectStore);

    @Output() onClose = new EventEmitter<void>();

    newMemberEmail = '';
    isAdding = signal(false);
    errorMessage = signal<string | null>(null);

    async addMember() {
        const project = this.projectStore.selectedProject();
        if (!project || !this.newMemberEmail.trim()) return;

        this.isAdding.set(true);
        this.errorMessage.set(null);

        try {
            await this.projectStore.addMember(project.id, this.newMemberEmail);
            this.newMemberEmail = '';
        } catch (error: any) {
            this.errorMessage.set(error.message || 'Failed to add member');
        } finally {
            this.isAdding.set(false);
        }
    }

    closeModal() {
        this.onClose.emit();
    }
}
