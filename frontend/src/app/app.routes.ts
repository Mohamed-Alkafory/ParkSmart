import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ownerGuard } from './core/guards/owner.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'oauth-callback',
    loadComponent: () =>
      import('./features/auth/oauth-callback/oauth-callback').then(
        (m) => m.OAuthCallback,
      ),
  },

  {
    path: 'parkings',
    loadComponent: () =>
      import('./features/parkings/parking-list/parking-list').then(
        (m) => m.ParkingList,
      ),
  },
  {
    path: 'parkings/new',
    loadComponent: () =>
      import('./features/parkings/parking-create/parking-create').then(
        (m) => m.ParkingCreate,
      ),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'parkings/:id',
    loadComponent: () =>
      import('./features/parkings/parking-detail/parking-detail').then(
        (m) => m.ParkingDetail,
      ),
  },

  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/bookings/my-bookings/my-bookings').then(
        (m) => m.MyBookings,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import(
        './features/notifications/notifications-list/notifications-list'
      ).then((m) => m.NotificationsList),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'parkings' },
];
