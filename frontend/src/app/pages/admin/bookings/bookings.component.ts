import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type StatusFilter = 'all' | BookingStatus;

const PAGE_SIZE = 10;

interface PopulatedRef {
  name?: string;
  address?: string;
  spotNumber?: string;
}

/**
 * Admin bookings management (read-only). GET /api/bookings returns every booking
 * with parkingId/spotId/userId populated. Details expand inline because the
 * shared /bookings/:id page resolves from the viewer's own bookings only.
 */
@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [DatePipe, FormsModule, StatusBadgeComponent, PagerComponent, SidebarComponent, PageHeaderComponent],
  templateUrl: './bookings.component.html',
})
export class AdminBookingsComponent implements OnInit {
  private bookingsSvc = inject(BookingsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly bookings = signal<Booking[]>([]);
  readonly search = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly expandedId = signal<string | null>(null);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.bookings().filter((b) => {
      if (status !== 'all' && b.status !== status) return false;
      if (!term) return true;
      return (
        this.userName(b).toLowerCase().includes(term) ||
        this.parkingName(b).toLowerCase().includes(term)
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
    this.bookingsSvc.getAllBookings().subscribe({
      next: (res) => {
        this.bookings.set(res.data ?? []);
        this.page.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load bookings.');
        this.loading.set(false);
      },
    });
  }

  onFilterChange(): void {
    this.page.set(1);
  }

  toggleDetails(id?: string): void {
    if (!id) return;
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  parkingName(b: Booking): string {
    if (typeof b.parkingId === 'string') return 'Parking';
    return (b.parkingId as PopulatedRef | null)?.name ?? 'Deleted parking';
  }

  parkingAddress(b: Booking): string {
    if (typeof b.parkingId === 'string') return '';
    return (b.parkingId as PopulatedRef | null)?.address ?? '';
  }

  spotLabel(b: Booking): string {
    if (typeof b.spotId === 'string') return '—';
    return (b.spotId as PopulatedRef | null)?.spotNumber ?? '—';
  }

  userName(b: Booking): string {
    if (typeof b.userId === 'string') return 'User';
    return (b.userId as PopulatedRef).name ?? 'User';
  }
}
