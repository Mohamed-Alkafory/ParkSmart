import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { UsersService } from '../../../core/services/users.service';
import { Parking } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

type StatusFilter = 'all' | 'active' | 'inactive';

const PAGE_SIZE = 10;

interface SpotSummary {
  total: number;
  available: number;
}

/**
 * Admin parkings management. GET /api/parkings returns no owner populate, so
 * owner names are joined from GET /api/users. Spot totals come from
 * GET /api/spots/parking/:id. "Active" means the parking has at least one spot.
 */
@Component({
  selector: 'app-admin-parkings',
  standalone: true,
  imports: [RouterLink, FormsModule, RatingComponent, StatusBadgeComponent, PagerComponent, SidebarComponent],
  templateUrl: './parkings.component.html',
})
export class AdminParkingsComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private spotsSvc = inject(SpotsService);
  private usersSvc = inject(UsersService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly items = signal<Parking[]>([]);
  readonly ownerNames = signal<Record<string, string>>({});
  readonly spotSummaries = signal<Record<string, SpotSummary>>({});
  readonly search = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.items().filter((p) => {
      if (term) {
        const owner = (this.ownerNames()[p.ownerId] ?? '').toLowerCase();
        if (
          !p.name.toLowerCase().includes(term) &&
          !p.address.toLowerCase().includes(term) &&
          !owner.includes(term)
        ) {
          return false;
        }
      }
      if (status === 'all') return true;
      const summary = p._id ? this.spotSummaries()[p._id] : undefined;
      if (!summary) return status === 'active';
      return status === 'active' ? summary.total > 0 : summary.total === 0;
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
    forkJoin({
      parkings: this.parkingsSvc.getAll(),
      users: this.usersSvc.getAll().pipe(catchError(() => of({ success: false as const, data: undefined }))),
    }).subscribe({
      next: ({ parkings, users }) => {
        const list = parkings.data ?? [];
        this.items.set(list);
        const names: Record<string, string> = {};
        for (const u of users.data ?? []) {
          if (u._id) names[u._id] = u.name;
        }
        this.ownerNames.set(names);
        this.page.set(1);
        this.loading.set(false);
        this.loadSpotSummaries(list);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load parkings.');
        this.loading.set(false);
      },
    });
  }

  onFilterChange(): void {
    this.page.set(1);
  }

  ownerName(ownerId: string): string {
    return this.ownerNames()[ownerId] ?? 'Unknown owner';
  }

  summary(parkingId?: string): SpotSummary | null {
    if (!parkingId) return null;
    return this.spotSummaries()[parkingId] ?? null;
  }

  spotStatus(summary: SpotSummary | null): string {
    if (!summary) return 'maintenance';
    if (summary.total === 0) return 'maintenance';
    return summary.available > 0 ? 'available' : 'booked';
  }

  spotLabel(summary: SpotSummary | null): string {
    if (!summary) return 'Unknown';
    if (summary.total === 0) return 'No spots';
    return summary.available > 0 ? `${summary.available}/${summary.total} free` : 'Full';
  }

  remove(id?: string): void {
    if (!id || this.deletingId()) return;
    if (!confirm('Delete this parking? Blocked if spots or active bookings remain.')) return;
    this.deletingId.set(id);
    this.notice.set(null);
    this.parkingsSvc.delete(id).subscribe({
      next: () => {
        this.items.update((list) => list.filter((p) => p._id !== id));
        this.notice.set('Parking deleted.');
        this.deletingId.set(null);
      },
      error: (err) => {
        this.error.set(
          err?.error?.message ??
            'Could not delete the parking (requires ownership on the backend).',
        );
        this.deletingId.set(null);
      },
    });
  }

  private loadSpotSummaries(list: Parking[]): void {
    const ids = list.map((p) => p._id).filter((id): id is string => !!id);
    if (ids.length === 0) {
      this.spotSummaries.set({});
      return;
    }
    forkJoin(
      ids.map((id) =>
        this.spotsSvc
          .getByParking(id)
          .pipe(catchError(() => of({ success: false as const, data: undefined }))),
      ),
    ).subscribe((responses) => {
      const summaries: Record<string, SpotSummary> = {};
      responses.forEach((res, i) => {
        if (res.data) {
          summaries[ids[i]] = {
            total: res.data.length,
            available: res.data.filter((s) => s.status === 'available').length,
          };
        }
      });
      this.spotSummaries.set(summaries);
    });
  }
}
