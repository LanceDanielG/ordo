import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
            <div *ngFor="let toast of ns.toasts()" 
                 class="toast" 
                 [class]="toast.type"
                 (click)="ns.remove(toast.id)">
                <span class="material-icons">{{ getIcon(toast.type) }}</span>
                <span class="message">{{ toast.message }}</span>
            </div>
        </div>
    `,
    styles: [`
        .toast-container {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            z-index: 9999;
            pointer-events: none;
        }

        .toast {
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            color: var(--text-base);
            cursor: pointer;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            min-width: 280px;
            max-width: 400px;
            backdrop-blur: 10px;
        }

        .toast.success { border-left: 4px solid #10b981; }
        .toast.info { border-left: 4px solid var(--primary); }
        .toast.warning { border-left: 4px solid #f59e0b; }
        .toast.error { border-left: 4px solid #ef4444; }

        .material-icons {
            font-size: 1.25rem;
        }

        .toast.success .material-icons { color: #10b981; }
        .toast.info .material-icons { color: var(--primary); }
        .toast.warning .material-icons { color: #f59e0b; }
        .toast.error .material-icons { color: #ef4444; }

        .message {
            font-size: 0.9rem;
            font-weight: 600;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `]
})
export class ToastComponent {
    ns = inject(NotificationService);

    getIcon(type: string) {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    }
}
