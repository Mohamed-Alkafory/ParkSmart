import { Component, inject, signal } from '@angular/core';
import { ParkingsService } from '../../../core/services/parkings.service';
import { Parking } from '../../../core/models/api.models';

// TODO (team): all parkings table. GET /api/parkings (needs backend fetchAllParkings — Member 2 TODO — Member 2 TODO). Delete needs backend DELETE /api/parkings/:id (not yet existent). Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-parkings', standalone: true, templateUrl: './parkings.component.html' })
export class AdminParkingsComponent {
  private parkingsSvc = inject(ParkingsService);
  readonly items = signal<Parking[]>([]);
  // TODO: load() + remove() (blocked on backend list/delete).
  load(): void { void this.parkingsSvc; throw new Error('Not implemented — needs backend fetchAllParkings — Member 2 TODO'); }
}
