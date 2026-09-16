import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { Parking } from '../../../core/models/api.models';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

interface SpotSummary {
  total: number;
  available: number;
}

/**
 * Owner's parkings list. GET /api/parkings/mine + per-parking spot counts
 * from GET /api/spots/parking/:id. Actions: view spots, edit, delete.
 */
@Component({
  selector: 'app-my-parking',
  standalone: true,
  imports: [RouterLink, RatingComponent, SidebarComponent],
  templateUrl: './my-parking.component.html',
})
export class MyParkingComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private spotsSvc = inject(SpotsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  readonly items = signal<Parking[]>([]);
  readonly spotSummaries = signal<Record<string, SpotSummary>>({});
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly count = computed(() => this.items().length);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.parkingsSvc.getMine().subscribe({
      next: (res) => {
        const list = res.data ?? [];
        this.items.set(list);
        this.loading.set(false);
        this.loadSpotSummaries(list);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load your parkings.');
        this.loading.set(false);
      },
    });
  }

  summary(parkingId?: string): SpotSummary | null {
    if (!parkingId) return null;
    return this.spotSummaries()[parkingId] ?? null;
  }

  remove(id?: string): void {
    if (!id || this.deletingId()) return;
    if (!confirm('Delete this parking? This cannot be undone.')) return;
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
            'Could not delete the parking. Remove spots and wait for active bookings to finish first.',
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
