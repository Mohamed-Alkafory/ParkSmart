import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getToken } from './auth.guard';
import { getUserRole } from './owner.guard';

/**
 * Generic role guard — follows owner.guard.ts pattern.
 * Usage in app.routes.ts: canActivate: [authGuard, roleGuard(['admin'])]
 *
 * TODO (team):
 *  1. Extend getUserRole() usage — no code needed, reuse owner.guard helpers.
 *  2. Add 'driver' | 'owner' | 'admin' checks per route (see pages/driver|owner|admin).
 *  3. Redirect unauthorized users to '/parkings' (pattern matches ownerGuard).
 */
export function roleGuard(allowed: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    // TODO: if (!getToken()) return login UrlTree with returnUrl (copy ownerGuard).
    // TODO: if (!allowed.includes(getUserRole() ?? '')) return UrlTree to '/parkings'.
    // TODO: return true otherwise.
    void allowed;
    void router;
    void state;
    void getToken;
    void getUserRole;
    throw new Error('Not implemented — see TODOs above');
  };
}
