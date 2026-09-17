import { Component, computed, input } from '@angular/core';
import { Review } from '../../../core/models/api.models';
import { RatingComponent } from '../rating/rating.component';

/**
 * Rating breakdown computed from an already-loaded review list:
 * big average + star bars per rating (5..1). No service calls here.
 */
@Component({
  selector: 'app-review-summary',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './review-summary.component.html',
})
export class ReviewSummaryComponent {
  readonly reviews = input<Review[]>([]);

  readonly stats = computed(() => {
    const list = this.reviews();
    const dist = [5, 4, 3, 2, 1].map((star) => {
      const count = list.filter((r) => Math.round(r.rating) === star).length;
      return {
        star,
        count,
        pct: list.length > 0 ? Math.round((count / list.length) * 100) : 0,
      };
    });
    const avg = list.length > 0 ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
    return { avg: Math.round(avg * 10) / 10, total: list.length, dist };
  });
}
