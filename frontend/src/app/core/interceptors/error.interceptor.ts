import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Global error interceptor — companion to auth.interceptor.ts.
 * Register in app.config.ts: withInterceptors([authInterceptor, errorInterceptor]).
 *
 * TODO (team):
 *  1. Catch HttpErrorResponse via catchError().
 *  2. On 401: clear 'parksmart_token' + 'parksmart_user' and navigate to '/login'.
 *  3. On 403: navigate to '/parkings' (pattern matches ownerGuard redirect).
 *  4. Re-throw so feature components can set their error() signal from err.error?.message.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // TODO: return next(req).pipe(catchError((err: HttpErrorResponse) => {...})).
  void router;
  void catchError;
  void throwError;
  void HttpErrorResponse;
  return next(req);
};
