import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkMode = signal<boolean>(true); // Default to dark as requested

    constructor() {
        const saved = localStorage.getItem('ordo-theme');
        if (saved) {
            this.isDarkMode.set(saved === 'dark');
        }

        effect(() => {
            const mode = this.isDarkMode() ? 'dark' : 'light';
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(mode);
            localStorage.setItem('ordo-theme', mode);
        });
    }

    toggleTheme() {
        this.isDarkMode.update(curr => !curr);
    }
}
