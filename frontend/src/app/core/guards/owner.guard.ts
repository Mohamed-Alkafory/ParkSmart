import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getToken } from './auth.guard';

export const USER_KEY = 'parksmart_user';

interface JwtPayload {
  id?: string;
  userId?: string;
  role?: string;
  exp?: number;
}

export function getUserRole(): string | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.role) {
        return user.role;
      }
    }
  } catch {
    // fall through to token decode
  }

  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export const ownerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!getToken()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (getUserRole() === 'owner') {
    return true;
  }

  return router.createUrlTree(['/parkings']);
};
