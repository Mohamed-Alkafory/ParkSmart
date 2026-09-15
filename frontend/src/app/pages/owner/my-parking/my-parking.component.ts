import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';
import { Parking } from '../../../core/models/api.models';

// TODO (team): owner's parkings. GET /api/parkings then filter by ownerId (backend has no owner filter). Render <app-parking-card> + Edit/Manage-spots links. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-my-parking', standalone: true, imports: [RouterLink], templateUrl: './my-parking.component.html' })
export class MyParkingComponent {
  private parkingsSvc = inject(ParkingsService);
  readonly items = signal<Parking[]>([]);
  // TODO: ngOnInit getAll() + filter.
  load(): void { void this.parkingsSvc; throw new Error('Not implemented'); }
}
