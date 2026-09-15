import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpotsService } from '../../../core/services/spots.service';
import { Spot } from '../../../core/models/api.models';
import { ParkingSpotComponent } from '../../../shared/components/parking-spot/parking-spot.component';

/**
 * Driver spot picker.
 * It displays only available spots and keeps the selected spot ID for booking.
 */
@Component({
  selector: 'app-select-spot',
  standalone: true,
  imports: [RouterLink, ParkingSpotComponent],
  templateUrl: './select-spot.component.html',
})
export class SelectSpotComponent implements OnInit {
  private spotsSvc = inject(SpotsService);

  // Parking ID comes from /driver/parkings/:id/select-spot.
  readonly id = input<string>('');
  readonly spots = signal<Spot[]>([]);
  readonly selectedSpotId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  /** Loads the parking spots and keeps only the available ones. */
  load(): void {
    const parkingId = this.id();

    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.spotsSvc.getByParking(parkingId).subscribe({
      next: (response) => {
        const availableSpots = (response.data ?? []).filter((spot) => spot.status === 'available');
        this.spots.set(availableSpots);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load available spots.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  /** Stores the spot selected by the driver. */
  selectSpot(spotId: string): void {
    this.selectedSpotId.set(spotId);
  }
}
