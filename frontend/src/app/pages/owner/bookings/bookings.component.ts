import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

type StatusFilter = 'all' | BookingStatus;

interface PopulatedUser {
  name?: string;
  email?: string;
}

/**
 * Owner bookings page. GET /api/bookings/owner returns bookings of the owner's
 * parkings with parkingId/spotId/userId populated. Filter by status, complete or cancel.
 */
@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [DatePipe, FormsModule, StatusBadgeComponent, SidebarComponent],
  templateUrl: './bookings.component.html',
})
export class OwnerBookingsComponent implements OnInit {
  private bookingsSvc = inject(BookingsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  readonly bookings = signal<Booking[]>([]);
  readonly filter = signal<StatusFilter>('all');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly actingId = signal<string | null>(null);

  readonly filtered = computed(() => {
    const f = this.filter();
    const list = this.bookings();
    return f === 'all' ? list : list.filter((b) => b.status === f);
  });

  readonly revenue = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0),
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookingsSvc.getOwnerBookings().subscribe({
      next: (res) => {
        this.bookings.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load bookings.');
        this.loading.set(false);
      },
    });
  }

  parkingName(b: Booking): string {
    return typeof b.parkingId === 'string' ? 'Parking' : (b.parkingId.name ?? 'Parking');
  }

  spotLabel(b: Booking): string {
    return typeof b.spotId === 'string' ? '—' : (b.spotId.spotNumber ?? '—');
  }

  driverName(b: Booking): string {
    if (typeof b.userId === 'string') return 'Driver';
    return (b.userId as PopulatedUser).name ?? 'Driver';
  }

  driverEmail(b: Booking): string {
    if (typeof b.userId === 'string') return '';
    return (b.userId as PopulatedUser).email ?? '';
  }

  complete(id?: string): void {
    this.changeStatus(id, 'completed', 'Booking marked as completed.');
  }

  cancel(id?: string): void {
    if (id && !confirm('Cancel this booking? The spot becomes available again.')) return;
    this.changeStatus(id, 'cancelled', 'Booking cancelled.');
  }

  private changeStatus(id: string | undefined, status: BookingStatus, okMessage: string): void {
    if (!id || this.actingId()) return;
    this.actingId.set(id);
    this.notice.set(null);
    this.bookingsSvc.updateStatus(id, status).subscribe({
      next: (res) => {
        const updated = res.data;
        this.bookings.update((list) =>
          list.map((b) => (b._id === id ? (updated ?? { ...b, status }) : b)),
        );
        this.notice.set(okMessage);
        this.actingId.set(null);
      },
      error: (err) => {
        this.notice.set(err?.error?.message ?? 'Could not update the booking.');
        this.actingId.set(null);
      },
    });
  }
}
