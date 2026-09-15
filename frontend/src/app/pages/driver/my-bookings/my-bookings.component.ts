import { Component, inject, signal } from '@angular/core';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking } from '../../../core/models/api.models';

// TODO (team): mirror features/bookings/my-bookings. GET /api/bookings/my -> bookings signal; cancelBooking() PATCH :id/status {cancelled}; completeBooking() {completed}. Render <app-booking-card> + states. Guard: authGuard.
@Component({ selector: 'app-driver-bookings', standalone: true, templateUrl: './my-bookings.component.html' })
export class DriverBookingsComponent {
  private bookingsSvc = inject(BookingsService);
  readonly bookings = signal<Booking[]>([]);
  // TODO: ngOnInit getMine() + cancelBooking()/completeBooking() per my-bookings TODOs 1-3.
  load(): void { void this.bookingsSvc; throw new Error('Not implemented'); }
}
