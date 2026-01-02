import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map } from 'rxjs';

const waitForAuth = async (auth: AuthService) => {
    if (!auth.loading()) return true;

    // Convert signal to observable and wait for loading to be false
    return await firstValueFrom(
        toObservable(auth.loading).pipe(
            filter(loading => !loading),
            map(() => true)
        )
    );
};

export const authGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    await waitForAuth(auth);

    if (auth.isAuthenticated) {
        return true;
    }

    return router.navigate(['/login']);
};

export const loginGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    await waitForAuth(auth);

    if (auth.isAuthenticated) {
        return router.navigate(['/dashboard']);
    }

    return true;
};
