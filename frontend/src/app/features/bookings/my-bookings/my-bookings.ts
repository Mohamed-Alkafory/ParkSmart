import { Component, inject, signal } from '@angular/core';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../../core/models/api.models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [],
  templateUrl: './my-bookings.html',
})
export class MyBookings {
  private bookingsService = inject(BookingsService);

  readonly bookings = signal<Booking[]>([]);

  // TODO 1: in ngOnInit: call bookingsService.getMine()
  //   → GET /api/bookings/my, assign res.data ?? [] to bookings signal.
  // TODO 2: add cancelBooking(id): call bookingsService.updateStatus(id, 'cancelled')
  //   → PATCH /api/bookings/:id/status with { status: 'cancelled' },
  //   then reload the list or update the signal. Allowed: active|completed|cancelled.
  // TODO 3 (optional): add completeBooking(id) the same way with 'completed'.
}
