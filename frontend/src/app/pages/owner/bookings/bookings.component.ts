import { Component, signal } from '@angular/core';

// TODO (team): bookings for owner's parkings. Backend GET /api/bookings/my returns caller's own bookings only — GET /api/bookings/owner (owner role) with parking + spot + user populated. Show <app-booking-card> + <app-status-badge>; actions PATCH :id/status. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-bookings', standalone: true, templateUrl: './bookings.component.html' })
export class OwnerBookingsComponent {
  readonly bookings = signal<never[]>([]);
  // TODO: load() + updateStatus() once backend scope decided.
  load(): void { throw new Error('Not implemented'); }
}
