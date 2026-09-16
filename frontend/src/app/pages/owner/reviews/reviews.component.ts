import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParkingsService } from '../../../core/services/parkings.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Parking, Review } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

interface OwnerReview extends Review {
  parkingName: string;
  reviewerName: string;
  createdAt?: string;
}

// Owner reviews page (read-only). Loads the owner's parkings via GET /api/parkings/mine,
// then aggregates GET /api/reviews/parking/:parkingId per parking (reviewer name is populated).
@Component({ selector: 'app-owner-reviews', standalone: true, imports: [DatePipe, RatingComponent, SidebarComponent], templateUrl: './reviews.component.html' })
export class OwnerReviewsComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');
  private reviewsSvc = inject(ReviewsService);

  readonly items = signal<OwnerReview[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly averageRating = computed(() => {
    const list = this.items();
    if (list.length === 0) return 0;
    return Math.round((list.reduce((sum, r) => sum + r.rating, 0) / list.length) * 10) / 10;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.parkingsSvc.getMine().subscribe({
      next: (res) => {
        const parkings = res.data ?? [];
        if (parkings.length === 0) {
          this.items.set([]);
          this.loading.set(false);
          return;
        }
        this.loadReviews(parkings);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load reviews.');
        this.loading.set(false);
      },
    });
  }

  private loadReviews(parkings: Parking[]): void {
    forkJoin(
      parkings.map((p) =>
        this.reviewsSvc
          .getByParking(p._id ?? '')
          .pipe(catchError(() => of({ success: false as const, data: undefined }))),
      ),
    ).subscribe({
      next: (responses) => {
        const all: OwnerReview[] = [];
        responses.forEach((res, i) => {
          const parking = parkings[i];
          for (const r of res.data ?? []) {
            all.push({
              ...r,
              parkingName: parking.name,
              reviewerName:
                typeof r.userId === 'string'
                  ? 'Driver'
                  : ((r.userId as unknown as { name?: string }).name ?? 'Driver'),
              createdAt: (r as { createdAt?: string }).createdAt,
            });
          }
        });
        all.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        this.items.set(all);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load reviews.');
        this.loading.set(false);
      },
    });
  }
}
