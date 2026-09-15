import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getToken } from './auth.guard';
import { getUserRole } from './owner.guard';

/**
 * Generic role guard — follows owner.guard.ts pattern.
 * Usage in app.routes.ts: canActivate: [authGuard, roleGuard(['admin'])]
 * Checks 'driver' | 'owner' | 'admin' per route; unauthorized users
 * go to '/login' (no token) or '/parkings' (wrong role).
 */
export function roleGuard(allowed: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);

    if (!getToken()) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (!allowed.includes(getUserRole() ?? '')) {
      return router.createUrlTree(['/parkings']);
    }

    return true;
  };
}
