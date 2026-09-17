import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { Parking, Spot } from '../../../core/models/api.models';
import { ParkingSpotComponent } from '../../../shared/components/parking-spot/parking-spot.component';
import { resolveImageUrl } from '../../../core/utils/image-url';

/**
 * Driver spot picker.
 * Shows every spot (available green, booked red/disabled) and keeps the
 * selected spot ID for booking. Header shows the parking photo, name and price.
 */
@Component({
  selector: 'app-select-spot',
  standalone: true,
  imports: [RouterLink, ParkingSpotComponent],
  templateUrl: './select-spot.component.html',
})
export class SelectSpotComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private spotsSvc = inject(SpotsService);

  // Parking ID comes from /driver/parkings/:id/select-spot.
  readonly id = input<string>('');
  readonly parking = signal<Parking | null>(null);
  readonly spots = signal<Spot[]>([]);
  readonly selectedSpotId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly imageSrc = computed(() => resolveImageUrl(this.parking()?.imageUrl));
  readonly selectedSpot = computed(
    () => this.spots().find((s) => s._id === this.selectedSpotId()) ?? null,
  );
  readonly availableCount = computed(
    () => this.spots().filter((s) => s.status === 'available').length,
  );

  ngOnInit(): void {
    this.load();
  }

  /** Loads the parking header plus all of its spots. */
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
    }).subscribe({
      next: ({ parking, spots }) => {
        this.parking.set(parking.data ?? null);
        const list = spots.data ?? [];
        this.spots.set(list);
        if (!parking.data) this.error.set('Parking not found.');
        // Drop the selection if that spot just got booked.
        if (
          this.selectedSpotId() &&
          !list.some((s) => s._id === this.selectedSpotId() && s.status === 'available')
        ) {
          this.selectedSpotId.set(null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load available spots.');
        this.loading.set(false);
      },
    });
  }

  /** Stores the spot selected by the driver. */
  selectSpot(spotId: string): void {
    this.selectedSpotId.set(spotId);
  }
}
