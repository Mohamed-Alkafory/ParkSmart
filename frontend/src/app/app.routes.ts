import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ownerGuard } from './core/guards/owner.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },

  {
    path: 'parkings',
    loadComponent: () =>
      import('./features/parkings/parking-list/parking-list').then((m) => m.ParkingList),
  },
  {
    path: 'parkings/new',
    loadComponent: () =>
      import('./features/parkings/parking-create/parking-create').then((m) => m.ParkingCreate),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'parkings/:id',
    loadComponent: () =>
      import('./features/parkings/parking-detail/parking-detail').then((m) => m.ParkingDetail),
  },

  // Owner-only page for managing the spots inside one parking.
  {
    path: 'owner/parkings/:id/spots',
    loadComponent: () =>
      import('./pages/owner/parking-spots/parking-spots.component').then(
        (m) => m.OwnerParkingSpotsComponent,
      ),
    canActivate: [authGuard, ownerGuard],
  },

  // Driver selects one available spot before continuing to booking.
  {
    path: 'driver/parkings/:id/select-spot',
    loadComponent: () =>
      import('./pages/driver/select-spot/select-spot.component').then((m) => m.SelectSpotComponent),
    canActivate: [authGuard, roleGuard(['driver'])],
  },
  {
    path: 'driver/parkings/:id/booking',
    loadComponent: () =>
      import('./pages/driver/booking/booking.component').then((m) => m.BookingComponent),
    canActivate: [authGuard, roleGuard(['driver'])],
  },

  // Role-specific profile pages use the same protected users API.
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/driver/profile/profile.component').then((m) => m.DriverProfileComponent),
    canActivate: [authGuard, roleGuard(['driver'])],
  },
  {
    path: 'owner/profile',
    loadComponent: () =>
      import('./pages/owner/profile/profile.component').then((m) => m.OwnerProfileComponent),
    canActivate: [authGuard, ownerGuard],
  },

  // Admin gets a read-only overview of every spot in the system.
  {
    path: 'admin/spots',
    loadComponent: () =>
      import('./pages/admin/parking-spots/parking-spots.component').then(
        (m) => m.AdminSpotsComponent,
      ),
    canActivate: [authGuard, roleGuard(['admin'])],
  },

  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/bookings/my-bookings/my-bookings').then((m) => m.MyBookings),
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications-list/notifications-list').then(
        (m) => m.NotificationsList,
      ),
    canActivate: [authGuard],
  },

  // TEMPORARY development preview — remove with its component folder.
  {
    path: 'components-preview',
    loadComponent: () =>
      import('./pages/components-preview/components-preview.component').then(
        (m) => m.ComponentsPreviewComponent,
      ),
  },

  { path: '**', redirectTo: 'parkings' },
];
