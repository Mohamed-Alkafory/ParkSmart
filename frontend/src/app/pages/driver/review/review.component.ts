import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../../core/services/reviews.service';
import { ParkingsService } from '../../../core/services/parkings.service';
import { RatingComponent } from '../../../shared/components/rating/rating.component';

/**
 * Driver review page: Review in the design flow.
 * Route /driver/reviews/new?parkingId=&bookingId=.
 * POST /api/reviews { parkingId, rating 1..5, comment? }, then back to /bookings.
 */
@Component({
  selector: 'app-driver-review',
  standalone: true,
  imports: [FormsModule, RouterLink, RatingComponent],
  templateUrl: './review.component.html',
})
export class DriverReviewComponent implements OnInit {
  private reviews = inject(ReviewsService);
  private parkings = inject(ParkingsService);
  private router = inject(Router);

  readonly parkingId = input<string>('');
  readonly bookingId = input<string>('');

  readonly parkingName = signal<string>('');
  readonly rating = signal(0);
  readonly comment = signal('');
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.parkingId();
    if (!id) {
      this.error.set('Parking is missing. Please open this page from a completed booking.');
      return;
    }
    this.parkings.getById(id).subscribe({
      next: (res) => this.parkingName.set(res.data?.name ?? ''),
      error: () => this.parkingName.set(''),
    });
  }

  onSubmit(): void {
    if (this.rating() < 1 || this.rating() > 5) {
      this.error.set('Please select a rating from 1 to 5 stars.');
      return;
    }
    if (!this.parkingId() || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);
    const comment = this.comment().trim();
    this.reviews.create(this.parkingId(), this.rating(), comment || undefined).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/bookings']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not submit your review.');
        this.submitting.set(false);
      },
    });
  }
}
