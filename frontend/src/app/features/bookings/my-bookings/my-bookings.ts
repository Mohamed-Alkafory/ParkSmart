import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking } from '../../../core/models/api.models';
import { BookingCardComponent } from '../../../shared/components/booking-card/booking-card.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [RouterLink, BookingCardComponent],
  templateUrl: './my-bookings.html',
})
export class MyBookings implements OnInit {
  private bookingsService = inject(BookingsService);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly actingId = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookingsService.getMine().subscribe({
      next: (res) => {
        this.bookings.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load your bookings.');
        this.loading.set(false);
      },
    });
  }

  cancelBooking(id: string): void {
    this.changeStatus(id, 'cancelled', 'Booking cancelled.');
  }

  completeBooking(id: string): void {
    this.changeStatus(id, 'completed', 'Booking completed.');
  }

  private changeStatus(id: string, status: 'cancelled' | 'completed', okMessage: string): void {
    if (this.actingId()) return;
    this.actingId.set(id);
    this.notice.set(null);

    this.bookingsService.updateStatus(id, status).subscribe({
      next: (res) => {
        const updated = res.data;
        this.bookings.update((list) =>
          list.map((b) => (b._id === id ? (updated ?? { ...b, status }) : b)),
        );
        this.notice.set(okMessage);
        this.actingId.set(null);
      },
      error: (err) => {
        this.notice.set(err?.error?.message ?? 'Could not update the booking.');
        this.actingId.set(null);
      },
    });
  }
}
