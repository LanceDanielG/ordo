import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private toastsSignal = signal<Toast[]>([]);
    readonly toasts = this.toastsSignal.asReadonly();

    show(message: string, type: Toast['type'] = 'info', duration = 3000) {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, duration };

        this.toastsSignal.update(toasts => [...toasts, newToast]);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
    }

    remove(id: string) {
        this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
    }

    success(message: string) { this.show(message, 'success'); }
    info(message: string) { this.show(message, 'info'); }
    warning(message: string) { this.show(message, 'warning'); }
    error(message: string) { this.show(message, 'error'); }
}
