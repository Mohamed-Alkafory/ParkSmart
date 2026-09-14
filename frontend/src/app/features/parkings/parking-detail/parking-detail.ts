import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotsService } from '../../../core/services/spots.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { BookingsService } from '../../../core/services/bookings.service';
import { Spot, Review } from '../../../core/models/api.models';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './parking-detail.html',
})
export class ParkingDetail {
  private spotsService = inject(SpotsService);
  private reviewsService = inject(ReviewsService);
  private bookingsService = inject(BookingsService);

  // Route param: /parkings/:id — use input() with withComponentInputBinding().
  readonly id = input<string>('');

  readonly spots = signal<Spot[]>([]);
  readonly reviews = signal<Review[]>([]);

  // TODO 1: in ngOnInit (implement OnInit): call spotsService.getByParking(id)
  //   → GET /api/spots/parking/:parkingId, assign to spots signal.
  // TODO 2: in ngOnInit: call reviewsService.getByParking(id)
  //   → GET /api/reviews/parking/:parkingId, assign to reviews signal.
  //   Note: backend has NO GET /api/parkings/:id, so header info must come
  //   from navigation state or re-fetching the list.
  // TODO 3: add bookSpot() method: call bookingsService.create(parkingId, startTime, durationHours)
  //   → POST /api/bookings. Needs startTime + durationHours signals (form inputs).
  // TODO 4: add submitReview(): call reviewsService.create(parkingId, rating, comment?)
  //   → POST /api/reviews, rating 1..5.
  // TODO 5 (owner only): addSpot(), changeSpotStatus(), removeSpot() using SpotsService
  //   → POST /api/spots, PUT /api/spots/:id/status, DELETE /api/spots/:id.
  //   Gate the buttons in the template with an isOwner check (decode JWT role).
}
