import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UsersService } from '../../../core/services/users.service';
import { ParkingsService } from '../../../core/services/parkings.service';
import { BookingsService } from '../../../core/services/bookings.service';
import { Booking, Parking, User } from '../../../core/models/api.models';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import {
  ChartWidgetComponent,
  STATUS_COLORS,
} from '../../../shared/components/chart-widget/chart-widget.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatCardComponent, ChartWidgetComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private usersSvc = inject(UsersService);
  private parkingsSvc = inject(ParkingsService);
  private bookingsSvc = inject(BookingsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly users = signal<User[]>([]);
  readonly parkings = signal<Parking[]>([]);
  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statusColors = [STATUS_COLORS.active, STATUS_COLORS.completed, STATUS_COLORS.cancelled];

  readonly revenue = computed(() =>
    this.bookings()
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0),
  );

  readonly usersByRole = computed(() => {
    const list = this.users();
    return {
      labels: ['Drivers', 'Owners', 'Admins'],
      data: [
        list.filter((u) => u.role === 'driver').length,
        list.filter((u) => u.role === 'owner').length,
        list.filter((u) => u.role === 'admin').length,
      ],
    };
  });

  readonly bookingsByStatus = computed(() => {
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

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      users: this.usersSvc.getAll(),
      parkings: this.parkingsSvc.getAll(),
      bookings: this.bookingsSvc.getAllBookings(),
    }).subscribe({
      next: ({ users, parkings, bookings }) => {
        this.users.set(users.data ?? []);
        this.parkings.set(parkings.data ?? []);
        this.bookings.set(bookings.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load the dashboard.');
        this.loading.set(false);
      },
    });
  }
}
