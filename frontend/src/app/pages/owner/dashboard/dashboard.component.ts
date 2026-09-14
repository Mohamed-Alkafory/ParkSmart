import { Component, inject, signal } from '@angular/core';
import { ParkingsService } from '../../../core/services/parkings.service';
import { BookingsService } from '../../../core/services/bookings.service';

// TODO (team): owner KPIs. Combine GET /api/parkings (filter ownerId === currentUser._id) + GET /api/bookings/my + GET /api/notifications for counts. Render <app-stat-card> tiles. Guards: authGuard + ownerGuard/roleGuard(['owner']).
@Component({ selector: 'app-owner-dashboard', standalone: true, templateUrl: './dashboard.component.html' })
export class OwnerDashboardComponent {
  private parkings = inject(ParkingsService);
  private bookings = inject(BookingsService);
  readonly stats = signal<{label:string;value:string|number}[]>([]);
  // TODO: ngOnInit loads + computes totals (parkings, spots, active bookings, revenue).
  load(): void { void this.parkings; void this.bookings; throw new Error('Not implemented'); }
}
