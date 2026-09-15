import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TOKEN_KEY } from '../guards/auth.guard';
import { USER_KEY } from '../guards/owner.guard';

/**
 * Global error interceptor — companion to auth.interceptor.ts.
 * On 401: session is invalid/expired → clear stored credentials and go to login.
 * On 403: forbidden for this role → go to parkings (matches guards' redirect).
 * Always re-throws so components can show err.error?.message in their error() signal.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          } catch {
            // storage unavailable — continue to the login redirect
          }
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        } else if (err.status === 403) {
          router.navigate(['/parkings']);
        }
      }
      return throwError(() => err);
    }),
  );
};
