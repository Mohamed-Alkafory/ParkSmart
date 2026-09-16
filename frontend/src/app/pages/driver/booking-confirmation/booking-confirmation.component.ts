import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingsService } from '../../../core/services/bookings.service';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { Parking, Spot } from '../../../core/models/api.models';

/**
 * Booking confirmation page: Confirmation in the design flow.
 * Route /bookings/confirmation?parkingId=&spotId=&startTime=&durationHours=.
 * Shows a summary, then POST /api/bookings on confirm and routes to /bookings/success.
 * (Future wiring: point BookingComponent.onSubmit here instead of POSTing directly.)
 */
@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent implements OnInit {
  private bookings = inject(BookingsService);
  private parkings = inject(ParkingsService);
  private spots = inject(SpotsService);
  private router = inject(Router);

  readonly parkingId = input<string>('');
  readonly spotId = input<string>('');
  readonly startTime = input<string>('');
  readonly durationHours = input<string | number>('');

  readonly parking = signal<Parking | null>(null);
  readonly spot = signal<Spot | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly duration = computed(() => Number(this.durationHours()) || 0);
  readonly startDate = computed(() => {
    const d = new Date(this.startTime());
    return isNaN(d.getTime()) ? null : d;
  });
  readonly total = computed(() => {
    const price = this.parking()?.pricePerHour;
    if (price === undefined || !this.duration()) return null;
    return price * this.duration();
  });
  readonly valid = computed(
    () => !!this.parkingId() && !!this.startDate() && this.duration() >= 1,
  );

  ngOnInit(): void {
    if (!this.parkingId()) {
      this.error.set('Booking details are missing. Please start again from search.');
      return;
    }
    this.loading.set(true);
    forkJoin({
      parking: this.parkings.getById(this.parkingId()),
      spot: this.spotId()
        ? this.spots
            .getByParking(this.parkingId())
            .pipe(catchError(() => of({ success: false as const, data: undefined })))
        : of({ success: true as const, data: undefined }),
    }).subscribe({
      next: ({ parking, spot }) => {
        this.parking.set(parking.data ?? null);
        const found = (spot.data ?? []).find((s) => s._id === this.spotId());
        this.spot.set(found ?? null);
        if (!parking.data) this.error.set('Parking not found.');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load booking summary.');
        this.loading.set(false);
      },
    });
  }

  onConfirm(): void {
    if (!this.valid() || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);
    this.bookings
      .create(
        this.parkingId(),
        this.startDate()!.toISOString(),
        this.duration(),
        this.spotId() || undefined,
      )
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          void this.router.navigate(['/bookings/success'], {
            queryParams: { bookingId: res.data?._id ?? '' },
          });
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Could not confirm the booking.');
          this.submitting.set(false);
        },
      });
  }

  onCancel(): void {
    void this.router.navigate(['/driver/parkings', this.parkingId(), 'booking'], {
      queryParams: this.spotId() ? { spotId: this.spotId() } : {},
    });
  }
}
