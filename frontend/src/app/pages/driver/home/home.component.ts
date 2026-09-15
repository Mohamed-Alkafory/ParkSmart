import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';
import { Parking } from '../../../core/models/api.models';

// TODO (team): driver landing after login. GET /api/parkings (loadAll) + GET /api/parkings/nearby?lat=&lng=&maxDistance= (searchNearby). Render <app-parking-card> grid + <app-loading>/<app-empty-state>/<app-error-state>. Guard: authGuard.
@Component({ selector: 'app-driver-home', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './home.component.html' })
export class DriverHomeComponent {
  private parkings = inject(ParkingsService);
  readonly items = signal<Parking[]>([]);
  // TODO: lat/lng/maxDistance/loading/error signals + loadAll()/searchNearby() (copy features/parkings/parking-list TODOs 2-3).
  loadAll(): void { void this.parkings; throw new Error('Not implemented'); }
  searchNearby(): void { throw new Error('Not implemented'); }
}
