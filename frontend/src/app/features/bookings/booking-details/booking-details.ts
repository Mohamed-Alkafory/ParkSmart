import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { getUserRole } from '../../../core/guards/owner.guard';

/**
 * Booking details page: Booking Details in the design flow.
 * Route /bookings/:id. Backend has no GET /api/bookings/:id, so the booking
 * is resolved from GET /api/bookings/my by id. Supports cancel (active) and
 * links to the review page (completed).
 */
@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './booking-details.html',
})
export class BookingDetails {
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  readonly id = input<string>('');

  readonly booking = signal<Booking | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly acting = signal(false);

  readonly parkingName = computed(() => {
    const b = this.booking();
    if (!b) return '';
    if (typeof b.parkingId === 'string') return 'Parking';
    return b.parkingId?.name ?? 'Deleted parking';
  });

  readonly parkingAddress = computed(() => {
    const b = this.booking();
    if (!b || typeof b.parkingId === 'string') return '';
    return b.parkingId?.address ?? '';
  });

  readonly parkingIdValue = computed(() => {
    const b = this.booking();
    if (!b) return '';
    return typeof b.parkingId === 'string' ? b.parkingId : (b.parkingId?._id ?? '');
  });

  readonly spotLabel = computed(() => {
    const b = this.booking();
    if (!b) return 'Auto-assigned';
    return typeof b.spotId === 'string' ? 'Auto-assigned' : (b.spotId?.spotNumber ?? '—');
  });

  readonly isActive = computed(() => this.booking()?.status === 'active');
  readonly isCompleted = computed(() => this.booking()?.status === 'completed');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const bookingId = this.id();
    if (!bookingId) {
      this.error.set('Booking ID is missing.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.bookingsService.getMine().subscribe({
      next: (res) => {
        const found = (res.data ?? []).find((b) => b._id === bookingId) ?? null;
        if (found) {
          this.booking.set(found);
          this.loading.set(false);
          return;
        }
        // Owners open drivers' bookings (e.g. from the owner dashboard's
        // recent list) — those live in GET /api/bookings/owner, not /my.
        // Admins open any platform booking — those come from GET /api/bookings.
        const role = getUserRole();
        const fallback$ =
          role === 'owner'
            ? this.bookingsService.getOwnerBookings()
            : role === 'admin'
              ? this.bookingsService.getAllBookings()
              : null;
        if (!fallback$) {
          this.booking.set(null);
          this.error.set('Booking not found.');
          this.loading.set(false);
          return;
        }
        fallback$.subscribe({
          next: (fallbackRes) => {
            const fallbackFound =
              (fallbackRes.data ?? []).find((b) => b._id === bookingId) ?? null;
            this.booking.set(fallbackFound);
            if (!fallbackFound) this.error.set('Booking not found.');
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err?.error?.message ?? 'Could not load the booking.');
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load the booking.');
        this.loading.set(false);
      },
    });
  }

  cancelBooking(): void {
    const bookingId = this.id();
    if (!bookingId || this.acting()) return;
    if (!confirm('Cancel this booking?')) return;
    this.acting.set(true);
    this.notice.set(null);
    this.bookingsService.updateStatus(bookingId, 'cancelled').subscribe({
      next: (res) => {
        this.booking.set(res.data ?? { ...this.booking()!, status: 'cancelled' });
        this.notice.set('Booking cancelled.');
        this.acting.set(false);
      },
      error: (err) => {
        this.notice.set(err?.error?.message ?? 'Could not cancel the booking.');
        this.acting.set(false);
      },
    });
  }

  goToReview(): void {
    void this.router.navigate(['/driver/reviews/new'], {
      queryParams: { parkingId: this.parkingIdValue(), bookingId: this.id() },
    });
  }
}
