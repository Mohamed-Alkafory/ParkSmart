import { Component, signal } from '@angular/core';

// TODO (team): platform KPIs — users, parkings, bookings, revenue. Needs GET /api/users (admin), GET /api/parkings, GET /api/bookings/my (or admin-wide once added). Render <app-stat-card>. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-dashboard', standalone: true, templateUrl: './dashboard.component.html' })
export class AdminDashboardComponent {
  readonly stats = signal<{label:string;value:string|number}[]>([]);
  // TODO: ngOnInit aggregate counts.
  load(): void { throw new Error('Not implemented'); }
}
