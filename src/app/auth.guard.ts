import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated) {
        return true;
    }

    return router.navigate(['/login']);
};

export const loginGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated) {
        return router.navigate(['/dashboard']);
    }

    return true;
};
