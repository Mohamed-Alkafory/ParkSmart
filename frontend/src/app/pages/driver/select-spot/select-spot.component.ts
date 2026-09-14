import { Component, inject, input, signal } from '@angular/core';
import { SpotsService } from '../../../core/services/spots.service';
import { Spot } from '../../../core/models/api.models';

// TODO (team): spot picker. Route .../select-spot with parking id input. GET /api/spots/parking/:id, filter status==available, render <app-parking-spot selectable> grid, store selectedSpotId, CTA to booking. Guard: authGuard.
@Component({ selector: 'app-select-spot', standalone: true, templateUrl: './select-spot.component.html' })
export class SelectSpotComponent {
  private spotsSvc = inject(SpotsService);
  readonly id = input<string>('');
  readonly spots = signal<Spot[]>([]);
  readonly selectedSpotId = signal<string | null>(null);
  // TODO: ngOnInit load + select(id) setter.
  load(): void { void this.spotsSvc; void this.id; throw new Error('Not implemented'); }
}
