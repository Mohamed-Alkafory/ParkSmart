import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Parking, Review, Spot } from '../../../core/models/api.models';
import { ParkingSpotComponent } from '../../../shared/components/parking-spot/parking-spot.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

/**
 * Driver parking details page: Parking Details in the design flow.
 * Route /driver/parkings/:id. Loads header (GET /api/parkings/:id),
 * spots (GET /api/spots/parking/:id) and reviews (GET /api/reviews/parking/:id)
 * in parallel, then links onward to select-spot / booking.
 */
@Component({
  selector: 'app-parking-details',
  standalone: true,
  imports: [RouterLink, ParkingSpotComponent, RatingComponent, StatusBadgeComponent],
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
  readonly coordinates = computed(() => {
    const coords = this.parking()?.location.coordinates;
    if (!coords) return null;
    return { lng: coords[0], lat: coords[1] };
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
