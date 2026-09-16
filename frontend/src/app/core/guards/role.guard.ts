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
 */
export function roleGuard(allowed: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);

    if (!getToken()) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (allowed.includes(getUserRole() ?? '')) {
      return true;
    }

    return router.createUrlTree(['/parkings']);
  };
}