import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ProjectStore } from '../../store/project.store';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    auth = inject(AuthService);
    theme = inject(ThemeService);
    projectStore = inject(ProjectStore);
    notification = inject(NotificationService);

    isCollapsed = signal(false);

    toggleCollapse() {
        this.isCollapsed.update(v => !v);
    }

    logout() {
        this.auth.signOut();
    }

    navigateToComingSoon(event: Event, feature: string) {
        event.preventDefault();
        this.notification.info(`${feature} coming soon!`);
    }
}
