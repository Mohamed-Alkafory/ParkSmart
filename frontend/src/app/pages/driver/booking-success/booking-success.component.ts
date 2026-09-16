import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking } from '../../../core/models/api.models';

/**
 * Booking success page: Success in the design flow.
 * Route /bookings/success?bookingId=. Shows the new booking id plus
 * a summary when the booking is found in GET /api/bookings/my.
 */
@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-success.component.html',
})
export class BookingSuccessComponent implements OnInit {
  private bookings = inject(BookingsService);

  readonly bookingId = input<string>('');
  readonly booking = signal<Booking | null>(null);

  readonly parkingName = signal<string>('');
  readonly totalPrice = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.bookingId();
    if (!id) return;
    this.bookings.getMine().subscribe({
      next: (res) => {
        const found = (res.data ?? []).find((b) => b._id === id) ?? null;
        this.booking.set(found);
        if (found) {
          const parking = found.parkingId;
          this.parkingName.set(typeof parking === 'string' ? '' : parking.name);
          this.totalPrice.set(found.totalPrice);
        }
      },
      error: () => {
        // Summary is a bonus; the success state itself does not depend on it.
      },
    });
  }
}
