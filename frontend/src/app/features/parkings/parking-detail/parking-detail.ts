import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Parking, Review, Spot } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ReviewSummaryComponent } from '../../../shared/components/review-summary/review-summary.component';
import { getToken } from '../../../core/guards/auth.guard';
import { getUserRole } from '../../../core/guards/owner.guard';
import { resolveParkingImage } from '../../../core/utils/image-url';

/**
 * Public parking details page (route /parkings/:id) — no login required.
 * Same data pattern as the driver details page: GET /api/parkings/:id header
 * plus GET /api/spots/parking/:id and GET /api/reviews/parking/:id in parallel.
 * The CTA adapts: anonymous visitors go to /login (with returnUrl into the
 * driver flow), signed-in drivers go straight to select-spot, other roles
 * fall back to browsing /parkings.
 */
@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [
    RouterLink,
    RatingComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ReviewSummaryComponent,
  ],
  templateUrl: './parking-detail.html',
})
export class ParkingDetail implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private spotsSvc = inject(SpotsService);
  private reviewsSvc = inject(ReviewsService);

  // Route param: /parkings/:id — use input() with withComponentInputBinding().
  readonly id = input<string>('');

  readonly parking = signal<Parking | null>(null);
  readonly spots = signal<Spot[]>([]);
  readonly reviews = signal<Review[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly availableSpots = computed(() => this.spots().filter((s) => s.status === 'available'));
  readonly bookedSpots = computed(() => this.spots().filter((s) => s.status === 'booked'));
  readonly canBook = computed(() => this.availableSpots().length > 0);

  /** Resolved parking photo URL (null = gradient header only). */
  readonly imageSrc = computed(() => resolveParkingImage(this.parking()));

  /** Admins can't book — hide the booking actions for them instead of bouncing to /parkings. */
  readonly isAdmin = computed(() => getUserRole() === 'admin');

  /** Reviewer display name — userId arrives populated with the name. */
  reviewerName(review: Review): string {
    if (typeof review.userId === 'string') return 'Driver';
    return (review.userId as unknown as { name?: string })?.name ?? 'Driver';
  }

  reviewerInitial(review: Review): string {
    return this.reviewerName(review).charAt(0).toUpperCase();
  }

  /** Review date (backend timestamps) formatted like "Sep 10, 2025". */
  reviewDate(review: Review): string {
    const raw = (review as unknown as { createdAt?: string }).createdAt;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /** Where "Book Now" goes, depending on who is looking at the page. */
  readonly ctaLink = computed(() => {
    const parkingId = this.id();
    if (!getToken()) {
      return {
        commands: ['/login'],
        queryParams: { returnUrl: `/driver/parkings/${parkingId}/select-spot` },
      };
    }
    if (getUserRole() === 'driver' || getUserRole() === 'owner') {
      return {
        commands: ['/driver/parkings', parkingId, 'select-spot'],
        queryParams: {},
      };
    }
    return { commands: ['/parkings'], queryParams: {} };
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const parkingId = this.id();
    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      parking: this.parkingsSvc.getById(parkingId),
      spots: this.spotsSvc.getByParking(parkingId),
      reviews: this.reviewsSvc.getByParking(parkingId),
    }).subscribe({
      next: ({ parking, spots, reviews }) => {
        this.parking.set(parking.data ?? null);
        this.spots.set(spots.data ?? []);
        this.reviews.set(reviews.data ?? []);
        if (!parking.data) this.error.set('Parking not found.');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load parking details.');
        this.loading.set(false);
      },
    });
  }
}
