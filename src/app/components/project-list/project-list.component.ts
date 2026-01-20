import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectStore } from '../../store/project.store';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
    projectStore = inject(ProjectStore);

    showAddForm = signal(false);
    newProjectName = signal('');
    newProjectColor = signal('#06b6d4');

    toggleAddForm() {
        this.showAddForm.update(s => !s);
    }

    async addProject() {
        if (this.newProjectName().trim()) {
            await this.projectStore.addProject(this.newProjectName(), this.newProjectColor());
            this.newProjectName.set('');
            this.showAddForm.set(false);
        }
    }

    selectProject(id: string | null) {
        this.projectStore.selectProject(id);
    }
}
