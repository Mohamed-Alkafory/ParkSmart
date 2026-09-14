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

  // TODO 1: create signals: parkings = signal<Parking[]>([]), loading, error,
  //   plus lat / lng / maxDistance filter signals for the nearby search.
  readonly parkings = signal<Parking[]>([]);

  loadAll(): void {
    // TODO 2: call parkingsService.getAll() and subscribe();
    //   on next assign res.data ?? [] to parkings signal with .set().
    //   Use: subscribe({ next, error }).
    throw new Error('Not implemented — see TODO 2');
  }

  searchNearby(): void {
    // TODO 3: call parkingsService.getNearby(lat, lng, maxDistance) and
    //   assign result to parkings signal. Backend query: ?lat=&lng=&maxDistance= (meters, default 5000).
    throw new Error('Not implemented — see TODO 3');
  }
}
