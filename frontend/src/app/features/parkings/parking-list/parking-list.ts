import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParkingsService } from '../../../core/services/parkings.service';
import { SpotsService } from '../../../core/services/spots.service';
import { Parking } from '../../../core/models/api.models';
import { ParkingCardComponent } from '../../../shared/components/parking-card/parking-card.component';

/**
 * Driver search page: Search Results in the design flow.
 * Supports deep-linkable filters via query params (?q=&lat=&lng=&maxDistance=).
 * Backend has no `q` support on GET /api/parkings, so text search is a
 * client-side filter over name/address. lat/lng uses GET /api/parkings/nearby.
 * Cards navigate to the public /parkings/:id details page, whose CTA
 * forwards guests to /login and drivers into the guarded driver flow.
 */
@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [FormsModule, ParkingCardComponent],
  templateUrl: './parking-list.html',
})
export class ParkingList implements OnInit {
  private parkingsService = inject(ParkingsService);
  private spotsService = inject(SpotsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly parkings = signal<Parking[]>([]);
  readonly availableCounts = signal<Record<string, number>>({});
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly q = signal('');
  readonly lat = signal(30.0444);
  readonly lng = signal(31.2357);
  readonly maxDistance = signal(5000);
  readonly nearbyMode = signal(false);

  /** Client-side text filter (backend GET /api/parkings ignores `q`). */
  readonly filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    if (!term) return this.parkings();
    return this.parkings().filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    if (qp.has('q')) this.q.set(qp.get('q') ?? '');
    const lat = Number(qp.get('lat'));
    const lng = Number(qp.get('lng'));
    const max = Number(qp.get('maxDistance'));
    if (Number.isFinite(lat) && qp.has('lat')) this.lat.set(lat);
    if (Number.isFinite(lng) && qp.has('lng')) this.lng.set(lng);
    if (Number.isFinite(max) && max > 0) this.maxDistance.set(max);

    if (qp.has('lat') && qp.has('lng')) {
      this.nearbyMode.set(true);
      this.searchNearby();
    } else {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.nearbyMode.set(false);
    this.loading.set(true);
    this.error.set(null);
    this.syncQueryParams();

    this.parkingsService.getAll().subscribe({
      next: (res) => {
        const list = res.data ?? [];
        this.parkings.set(list);
        this.loading.set(false);
        this.loadAvailableCounts(list);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load parkings.');
        this.loading.set(false);
      },
    });
  }

  searchNearby(): void {
    this.nearbyMode.set(true);
    this.loading.set(true);
    this.error.set(null);
    this.syncQueryParams();

    this.parkingsService
      .getNearby(this.lat(), this.lng(), this.maxDistance())
      .subscribe({
        next: (res) => {
          const list = res.data ?? [];
          this.parkings.set(list);
          this.loading.set(false);
          this.loadAvailableCounts(list);
        },
        error: (err) => {
          this.error.set(
            err?.error?.message ?? 'Failed to search nearby parkings.',
          );
          this.loading.set(false);
        },
      });
  }

  /** Search button: nearby when lat/lng look intentional, otherwise full list + text filter. */
  onSearch(): void {
    if (this.nearbyMode()) this.searchNearby();
    else {
      this.loadAll();
    }
  }

  onReset(): void {
    this.q.set('');
    this.nearbyMode.set(false);
    this.loadAll();
  }

  availableCount(parkingId?: string): number | null {
    if (!parkingId) return null;
    return this.availableCounts()[parkingId] ?? null;
  }

  /** Keeps the URL shareable without re-triggering navigation (same-route signals already updated). */
  private syncQueryParams(): void {
    const queryParams: Record<string, string | number> = {};
    if (this.q().trim()) queryParams['q'] = this.q().trim();
    if (this.nearbyMode()) {
      queryParams['lat'] = this.lat();
      queryParams['lng'] = this.lng();
      queryParams['maxDistance'] = this.maxDistance();
    }
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  /** One GET /api/spots/parking/:id per parking; failures map to unknown (null shown as "—"). */
  private loadAvailableCounts(list: Parking[]): void {
    const ids = list.map((p) => p._id).filter((id): id is string => !!id);
    if (ids.length === 0) {
      this.availableCounts.set({});
      return;
    }
    forkJoin(
      ids.map((id) =>
        this.spotsService
          .getByParking(id)
          .pipe(catchError(() => of({ success: false as const, data: undefined }))),
      ),
    ).subscribe((responses) => {
      const counts: Record<string, number> = {};
      responses.forEach((res, i) => {
        if (res.data) {
          counts[ids[i]] = res.data.filter((s) => s.status === 'available').length;
        }
      });
      this.availableCounts.set(counts);
    });
  }
}
