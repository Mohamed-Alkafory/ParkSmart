import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';
import { Parking } from '../../../core/models/api.models';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './parking-list.html',
})
export class ParkingList {
  private parkingsService = inject(ParkingsService);

  readonly parkings = signal<Parking[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lat = signal(30.0444);
  readonly lng = signal(31.2357);
  readonly maxDistance = signal(5000);

  loadAll(): void {
    // TODO 2: call parkingsService.getAll() and subscribe();
    //   on next assign res.data ?? [] to parkings signal with .set().
    //   Use: subscribe({ next, error }).
    throw new Error('Not implemented — see TODO 2');
  }

  searchNearby(): void {
    this.loading.set(true);
    this.error.set(null);

    this.parkingsService
      .getNearby(this.lat(), this.lng(), this.maxDistance())
      .subscribe({
        next: (res) => {
          this.parkings.set(res.data ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(
            err.error?.message ?? 'Failed to search nearby parkings'
          );
          this.loading.set(false);
        },
      });
  }
}
