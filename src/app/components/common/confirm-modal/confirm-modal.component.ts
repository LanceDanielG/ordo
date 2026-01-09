import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all animate-scale-in">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-6 font-medium">{{ message }}</p>
        <div class="flex gap-3 justify-end">
          <button 
            (click)="onCancel.emit()"
            class="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            (click)="onConfirm.emit()"
            class="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold text-sm transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class ConfirmModalComponent {
    @Input() title = 'Confirm Action';
    @Input() message = 'Are you sure you want to proceed?';
    @Output() onConfirm = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();
}
