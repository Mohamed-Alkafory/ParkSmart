import { Component, signal } from '@angular/core';

// TODO (team): moderation queue. Backend has no list-all-reviews or DELETE /api/reviews/:id — needs Member 5 to add. Until then aggregate per parking via GET /api/reviews/parking/:id. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-reviews', standalone: true, templateUrl: './reviews.component.html' })
export class AdminReviewsComponent {
  readonly items = signal<never[]>([]);
  // TODO: load() + remove() (blocked on backend).
  load(): void { throw new Error('Not implemented — needs backend list/delete reviews'); }
}
