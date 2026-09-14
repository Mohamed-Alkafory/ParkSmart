import { Component, signal } from '@angular/core';

// TODO (team): all bookings. Backend GET /api/bookings/my is per-user — needs admin-wide endpoint (Member 4). Until then table stays empty with <app-empty-state>. Actions PATCH :id/status. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-bookings', standalone: true, templateUrl: './bookings.component.html' })
export class AdminBookingsComponent {
  readonly bookings = signal<never[]>([]);
  // TODO: load() + updateStatus() (blocked on admin-wide GET).
  load(): void { throw new Error('Not implemented — GET /api/bookings (admin) with parking + spot + user populated'); }
}
