import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ParkingsService } from '../../../core/services/parkings.service';
import { BookingsService } from '../../../core/services/bookings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { Booking, Parking } from '../../../core/models/api.models';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import {
  ChartWidgetComponent,
  STATUS_COLORS,
} from '../../../shared/components/chart-widget/chart-widget.component';

function parkingKey(b: Booking): string {
  return typeof b.parkingId === 'string' ? b.parkingId : (b.parkingId._id ?? '');
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink, StatCardComponent, ChartWidgetComponent],
  templateUrl: './dashboard.component.html',
})
export class OwnerDashboardComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private bookingsSvc = inject(BookingsService);
  private spotsSvc = inject(SpotsService);

  readonly parkings = signal<Parking[]>([]);
  readonly bookings = signal<Booking[]>([]);
  readonly totalSpots = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statusColors = [STATUS_COLORS.active, STATUS_COLORS.completed, STATUS_COLORS.cancelled];

  readonly activeCount = computed(() => this.bookings().filter((b) => b.status === 'active').length);
  readonly revenue = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0),
  );

  readonly statusBreakdown = computed(() => {
    const list = this.bookings();
    return {
      labels: ['Active', 'Completed', 'Cancelled'],
      data: [
        list.filter((b) => b.status === 'active').length,
        list.filter((b) => b.status === 'completed').length,
        list.filter((b) => b.status === 'cancelled').length,
      ],
    };
  });

  readonly revenuePerParking = computed(() => {
    const names = new Map(
      this.parkings().map((p) => [p._id ?? '', p.name] as const),
    );
    const totals = new Map<string, number>();
    for (const b of this.bookings()) {
      if (b.status !== 'completed') continue;
      const key = parkingKey(b);
      totals.set(key, (totals.get(key) ?? 0) + (b.totalPrice ?? 0));
    }
    return {
      labels: [...totals.keys()].map((id) => names.get(id) ?? 'Parking'),
      data: [...totals.values()],
    };
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      parkings: this.parkingsSvc.getMine(),
      bookings: this.bookingsSvc.getOwnerBookings(),
    })
      .pipe(
        switchMap(({ parkings, bookings }) => {
          this.parkings.set(parkings.data ?? []);
          this.bookings.set(bookings.data ?? []);
          const ids = this.parkings()
            .map((p) => p._id)
            .filter((id): id is string => !!id);
          if (ids.length === 0) return of([]);
          return forkJoin(ids.map((id) => this.spotsSvc.getByParking(id)));
        }),
      )
      .subscribe({
        next: (spotResponses) => {
          this.totalSpots.set(
            spotResponses.reduce((sum, res) => sum + (res.data ?? []).length, 0),
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Could not load the dashboard.');
          this.loading.set(false);
        },
      });
  }
}
