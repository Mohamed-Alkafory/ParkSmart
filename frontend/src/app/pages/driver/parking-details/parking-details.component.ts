import { Component, inject, input, signal } from '@angular/core';
import { SpotsService } from '../../../core/services/spots.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Spot, Review } from '../../../core/models/api.models';

// TODO (team): driver parking detail. Route /driver/parkings/:id (input id). GET /api/spots/parking/:id + GET /api/reviews/parking/:id. Backend has NO GET /api/parkings/:id — get header from list/state — get header from list/state. Link onward to select-spot. Guard: authGuard.
@Component({ selector: 'app-parking-details', standalone: true, templateUrl: './parking-details.component.html' })
export class ParkingDetailsComponent {
  private spotsSvc = inject(SpotsService);
  private reviewsSvc = inject(ReviewsService);
  readonly id = input<string>('');
  readonly spots = signal<Spot[]>([]);
  readonly reviews = signal<Review[]>([]);
  // TODO: ngOnInit loads spots + reviews (copy features/parkings/parking-detail TODOs 1-2).
}
