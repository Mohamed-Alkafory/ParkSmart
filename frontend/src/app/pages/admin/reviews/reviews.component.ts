import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParkingsService } from '../../../core/services/parkings.service';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Parking, Review } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

type RatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

const PAGE_SIZE = 10;

interface AdminReview extends Review {
  parkingName: string;
  reviewerName: string;
  createdAt?: string;
}

/**
 * Admin review moderation. Backend has no GET /reviews list-all, so reviews are
 * aggregated per parking via GET /api/reviews/parking/:id. DELETE /:id is admin-allowed.
 */
@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [DatePipe, FormsModule, RatingComponent, PagerComponent, SidebarComponent],
  templateUrl: './reviews.component.html',
})
export class AdminReviewsComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private reviewsSvc = inject(ReviewsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly items = signal<AdminReview[]>([]);
  readonly search = signal('');
  readonly ratingFilter = signal<RatingFilter>('all');
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly ratingOptions: RatingFilter[] = ['all', 5, 4, 3, 2, 1];

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const rating = this.ratingFilter();
    return this.items().filter((r) => {
      if (rating !== 'all' && r.rating !== rating) return false;
      if (!term) return true;
      return (
        r.parkingName.toLowerCase().includes(term) ||
        r.reviewerName.toLowerCase().includes(term)
      );
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );

  readonly paged = computed(() => {
    const page = Math.min(this.page(), this.totalPages());
    return this.filtered().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.parkingsSvc.getAll().subscribe({
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

  onFilterChange(): void {
    this.page.set(1);
  }

  remove(id?: string): void {
    if (!id || this.deletingId()) return;
    if (!confirm('Delete this review? The parking rating will be recomputed.')) return;
    this.deletingId.set(id);
    this.notice.set(null);
    this.reviewsSvc.delete(id).subscribe({
      next: () => {
        this.items.update((list) => list.filter((r) => r._id !== id));
        this.notice.set('Review deleted.');
        this.deletingId.set(null);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not delete the review.');
        this.deletingId.set(null);
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
        const all: AdminReview[] = [];
        responses.forEach((res, i) => {
          const parking = parkings[i];
          for (const r of res.data ?? []) {
            all.push({
              ...r,
              parkingName: parking.name,
              reviewerName:
                typeof r.userId === 'string'
                  ? 'User'
                  : ((r.userId as unknown as { name?: string }).name ?? 'User'),
              createdAt: (r as { createdAt?: string }).createdAt,
            });
          }
        });
        all.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        this.items.set(all);
        this.page.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load reviews.');
        this.loading.set(false);
      },
    });
  }
}
