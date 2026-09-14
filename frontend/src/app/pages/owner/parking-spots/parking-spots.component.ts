import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotsService } from '../../../core/services/spots.service';
import { Spot, SpotStatus } from '../../../core/models/api.models';

// TODO (team): owner spot management. Input parking id. GET /api/spots/parking/:id; POST /api/spots { parkingId, spotNumber }; PUT /:id/status { available|booked }; DELETE /:id. Render <app-parking-spot> + add form. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-spots', standalone: true, imports: [FormsModule], templateUrl: './parking-spots.component.html' })
export class OwnerParkingSpotsComponent {
  private spotsSvc = inject(SpotsService);
  readonly id = input<string>('');
  readonly spots = signal<Spot[]>([]);
  // TODO: load() + addSpot() + changeStatus(id,status: SpotStatus) + removeSpot() per parking-detail TODO 5.
  load(): void { void this.spotsSvc; void this.id; throw new Error('Not implemented'); }
}
