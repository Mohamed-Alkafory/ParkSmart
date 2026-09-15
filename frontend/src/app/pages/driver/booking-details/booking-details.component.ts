import { Component, inject, input, signal } from '@angular/core';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking } from '../../../core/models/api.models';

// TODO (team): single booking view. Input id; backend has no GET by id — derive from GET /api/bookings/my + find by id. Show <app-status-badge> + cancel/complete actions (PATCH :id/status). Guard: authGuard.
@Component({ selector: 'app-booking-details', standalone: true, templateUrl: './booking-details.component.html' })
export class BookingDetailsComponent {
  private bookingsSvc = inject(BookingsService);
  readonly id = input<string>('');
  readonly booking = signal<Booking | null>(null);
  // TODO: ngOnInit load + cancel()/complete().
  load(): void { void this.bookingsSvc; void this.id; throw new Error('Not implemented'); }
}
