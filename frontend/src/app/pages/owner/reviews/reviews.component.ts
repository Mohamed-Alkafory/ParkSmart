import { Component, inject, signal } from '@angular/core';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Review } from '../../../core/models/api.models';

// TODO (team): reviews across owner's parkings. needs backend fetchReviewsByParking — Member 5 TODO (needs backend fetchReviewsByParking — Member 5 TODO — Member 5 TODO). Aggregate + render with <app-rating>. Read-only for owner. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-reviews', standalone: true, templateUrl: './reviews.component.html' })
export class OwnerReviewsComponent {
  private reviewsSvc = inject(ReviewsService);
  readonly items = signal<Review[]>([]);
  // TODO: ngOnInit loops owner parking ids -> getByParking().
  load(): void { void this.reviewsSvc; throw new Error('Not implemented — needs backend fetchReviewsByParking — Member 5 TODO'); }
}
