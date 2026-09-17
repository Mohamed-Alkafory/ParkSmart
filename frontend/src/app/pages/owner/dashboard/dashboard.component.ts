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
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

function parkingKey(b: Booking): string {
  if (typeof b.parkingId === 'string') return b.parkingId;
  return b.parkingId?._id ?? '';
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [RouterLink, StatCardComponent, ChartWidgetComponent, SidebarComponent, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
})
export class OwnerDashboardComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private bookingsSvc = inject(BookingsService);
  private spotsSvc = inject(SpotsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

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

  /** Last 5 bookings by start time — read-only slice of already-fetched data. */
  readonly recentBookings = computed(() =>
    [...this.bookings()]
      .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
      .slice(0, 5),
  );

  /** Display name for a booking's parking (populated object or plain id). */
  bookingParkingName(b: Booking): string {
    const p = b.parkingId;
    return typeof p === 'string' ? 'Parking' : (p?.name ?? 'Parking');
  }

  /** Active-booking count per property — bar chart data (labels + counts). */
  readonly activePerParking = computed(() => {
    const names = new Map(
      this.parkings().map((p) => [p._id ?? '', p.name] as const),
    );
    const counts = new Map<string, number>();
    for (const b of this.bookings()) {
      if (b.status !== 'active') continue;
      const key = parkingKey(b);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return {
      labels: [...counts.keys()].map((id) => names.get(id) ?? 'Parking'),
      data: [...counts.values()],
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
