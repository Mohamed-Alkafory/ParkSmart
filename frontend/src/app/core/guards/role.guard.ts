import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getToken } from './auth.guard';
import { getUserRole } from './owner.guard';

/**
 * Generic role guard — follows owner.guard.ts pattern.
 *
 * Usage in app.routes.ts:
 *   canActivate: [authGuard, roleGuard(['admin'])]
 *   canActivate: [authGuard, roleGuard(['owner', 'admin'])]
 *
 * Behavior:
 *   1. No token            → redirect to /login with returnUrl.
 *   2. Role not allowed    → redirect to /parkings (403-equivalent).
 *   3. Role allowed        → allow navigation.
 *
 * Note: this is UI-level protection only. Backend authorization is enforced
 * by requireRole() in auth.middleware.js (never rely on this guard alone).
 *
 * Checks 'driver' | 'owner' | 'admin' per route; unauthorized users
 * go to '/login' (no token) or '/parkings' (wrong role).
 */
export function roleGuard(allowed: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);

    // A missing token means the user must sign in first.
    if (!getToken()) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    // Logged-in users can open only pages allowed for their role.
    if (!allowed.includes(getUserRole() ?? '')) {
      return router.createUrlTree(['/parkings']);
    }

    return true;
  };
}