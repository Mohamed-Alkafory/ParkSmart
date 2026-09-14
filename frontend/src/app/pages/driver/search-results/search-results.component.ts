import { Component, inject, signal } from '@angular/core';
import { ParkingsService } from '../../../core/services/parkings.service';
import { Parking } from '../../../core/models/api.models';

// TODO (team): results for ?lat=&lng=&maxDistance=. GET /api/parkings/nearby. Read query params, call getNearby(), render <app-parking-card> list. Guard: authGuard.
@Component({ selector: 'app-search-results', standalone: true, templateUrl: './search-results.component.html' })
export class SearchResultsComponent {
  private parkings = inject(ParkingsService);
  readonly items = signal<Parking[]>([]);
  // TODO: ngOnInit reads query params -> getNearby(); handle loading/error signals.
  load(): void { void this.parkings; throw new Error('Not implemented'); }
}
