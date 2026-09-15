import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../../core/services/reviews.service';

// TODO (team): leave a review. POST /api/reviews { parkingId, rating 1..5, comment? }. Use <app-rating> for input. Guard: authGuard.
@Component({ selector: 'app-driver-review', standalone: true, imports: [FormsModule], templateUrl: './review.component.html' })
export class DriverReviewComponent {
  private reviews = inject(ReviewsService);
  readonly error = signal<string | null>(null);
  // TODO: parkingId/rating/comment signals + onSubmit().
  onSubmit(): void { void this.reviews; throw new Error('Not implemented'); }
}
