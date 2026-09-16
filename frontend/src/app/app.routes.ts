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
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
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
  // Legacy owner entry point (navbar "Add parking" still links here — NavbarComponent
  // is owned by another developer, so redirect instead of touching it).
  // Must stay BEFORE 'parkings/:id' or :id would swallow 'new'.
  // Target route keeps authGuard + ownerGuard, so roles are still enforced.
  {
    path: 'parkings/new',
    redirectTo: 'owner/parkings/new',
  },
  {
    path: 'parkings/:id',
    loadComponent: () =>
      import('./features/parkings/parking-detail/parking-detail').then((m) => m.ParkingDetail),
  },

  // Owner flow: dashboard → my parkings → add/edit → spots → bookings → reviews.
  {
    path: 'owner/parkings',
    loadComponent: () =>
      import('./pages/owner/my-parking/my-parking.component').then((m) => m.MyParkingComponent),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'owner/parkings/new',
    loadComponent: () =>
      import('./pages/owner/add-parking/add-parking.component').then(
        (m) => m.OwnerAddParkingComponent,
      ),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'owner/parkings/:id/edit',
    loadComponent: () =>
      import('./pages/owner/edit-parking/edit-parking.component').then(
        (m) => m.EditParkingComponent,
      ),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'owner/bookings',
    loadComponent: () =>
      import('./pages/owner/bookings/bookings.component').then((m) => m.OwnerBookingsComponent),
    canActivate: [authGuard, ownerGuard],
  },
  {
    path: 'owner/reviews',
    loadComponent: () =>
      import('./pages/owner/reviews/reviews.component').then((m) => m.OwnerReviewsComponent),
    canActivate: [authGuard, ownerGuard],
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
  {
    path: 'owner/dashboard',
    loadComponent: () =>
      import('./pages/owner/dashboard/dashboard.component').then(
        (m) => m.OwnerDashboardComponent,
      ),
    canActivate: [authGuard, ownerGuard],
  },

  // Booking flow (drivers + owners — backend POST /bookings allows any authenticated user):
  // details → select-spot → booking → confirmation → success → review.
  {
    path: 'driver/parkings/:id',
    loadComponent: () =>
      import('./pages/driver/parking-details/parking-details.component').then(
        (m) => m.ParkingDetailsComponent,
      ),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
  },
  {
    path: 'driver/parkings/:id/select-spot',
    loadComponent: () =>
      import('./pages/driver/select-spot/select-spot.component').then((m) => m.SelectSpotComponent),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
  },
  {
    path: 'driver/parkings/:id/booking',
    loadComponent: () =>
      import('./pages/driver/booking/booking.component').then((m) => m.BookingComponent),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
  },
  {
    path: 'driver/reviews/new',
    loadComponent: () =>
      import('./pages/driver/review/review.component').then((m) => m.DriverReviewComponent),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
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

  // Admin flow: dashboard → users → parkings → spots → bookings → reviews → notifications → settings.
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./pages/admin/users/users.component').then((m) => m.AdminUsersComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: 'admin/parkings',
    loadComponent: () =>
      import('./pages/admin/parkings/parkings.component').then((m) => m.AdminParkingsComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: 'admin/bookings',
    loadComponent: () =>
      import('./pages/admin/bookings/bookings.component').then((m) => m.AdminBookingsComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: 'admin/reviews',
    loadComponent: () =>
      import('./pages/admin/reviews/reviews.component').then((m) => m.AdminReviewsComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: 'admin/notifications',
    loadComponent: () =>
      import('./features/notifications/notifications-list/notifications-list').then(
        (m) => m.NotificationsList,
      ),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  {
    path: 'admin/settings',
    loadComponent: () =>
      import('./pages/admin/settings/settings.component').then((m) => m.AdminSettingsComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
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
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [authGuard, roleGuard(['admin'])],
  },

  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/bookings/my-bookings/my-bookings').then((m) => m.MyBookings),
    canActivate: [authGuard],
  },
  // Static booking routes must come before 'bookings/:id' or :id swallows them.
  {
    path: 'bookings/confirmation',
    loadComponent: () =>
      import('./pages/driver/booking-confirmation/booking-confirmation.component').then(
        (m) => m.BookingConfirmationComponent,
      ),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
  },
  {
    path: 'bookings/success',
    loadComponent: () =>
      import('./pages/driver/booking-success/booking-success.component').then(
        (m) => m.BookingSuccessComponent,
      ),
    canActivate: [authGuard, roleGuard(['driver', 'owner'])],
  },
  {
    path: 'bookings/:id',
    loadComponent: () =>
      import('./features/bookings/booking-details/booking-details').then((m) => m.BookingDetails),
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

  { path: '**', redirectTo: 'parkings' },
];
