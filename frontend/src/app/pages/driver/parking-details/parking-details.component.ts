import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Parking, Review, Spot } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { resolveImageUrl } from '../../../core/utils/image-url';
import { ReviewSummaryComponent } from '../../../shared/components/review-summary/review-summary.component';

/**
 * Driver parking details page: Parking Details in the design flow.
 * Route /driver/parkings/:id. Loads header (GET /api/parkings/:id),
 * spots (GET /api/spots/parking/:id) and reviews (GET /api/reviews/parking/:id)
 * in parallel, then links onward to select-spot / booking.
 */
@Component({
  selector: 'app-parking-details',
  standalone: true,
  imports: [RouterLink, RatingComponent, ReviewSummaryComponent],
  templateUrl: './parking-details.component.html',
})
export class ParkingDetailsComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private spotsSvc = inject(SpotsService);
  private reviewsSvc = inject(ReviewsService);

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
  readonly imageSrc = computed(() => resolveImageUrl(this.parking()?.imageUrl));

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
