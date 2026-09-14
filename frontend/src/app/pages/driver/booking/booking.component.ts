import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingsService } from '../../../core/services/bookings.service';

// TODO (team): booking form. POST /api/bookings { parkingId, startTime, durationHours } — backend auto-picks spot + totalPrice. Inputs: startTime datetime-local + durationHours. On success navigate to booking-confirmation with booking id. Guard: authGuard.
@Component({ selector: 'app-booking', standalone: true, imports: [FormsModule], templateUrl: './booking.component.html' })
export class BookingComponent {
  private bookings = inject(BookingsService);
  private router = inject(Router);
  readonly error = signal<string | null>(null);
  // TODO: parkingId/startTime/durationHours/loading signals + onSubmit() subscribe({next,error}).
  onSubmit(): void { void this.bookings; void this.router; throw new Error('Not implemented'); }
}
