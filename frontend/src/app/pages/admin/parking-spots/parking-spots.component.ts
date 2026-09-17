import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SpotsService } from '../../../core/services/spots.service';
import { Spot } from '../../../core/models/api.models';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type AdminSpot = Omit<Spot, 'parkingId'> & {
  parkingId: string | { _id: string; name: string; address?: string };
};

/**
 * Admin overview for every parking spot in the system.
 * This page is read-only because spot changes belong to the parking owner.
 */
@Component({
  selector: 'app-admin-spots',
  standalone: true,
  imports: [SidebarComponent, PageHeaderComponent],
  templateUrl: './parking-spots.component.html',
})
export class AdminSpotsComponent implements OnInit {
  private spotsSvc = inject(SpotsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly spots = signal<AdminSpot[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  /** Calls the admin-only GET /api/spots endpoint. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.spotsSvc.getAll().subscribe({
      next: (response) => this.spots.set((response.data ?? []) as AdminSpot[]),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load parking spots.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  /** Returns the populated parking name or its ID as a fallback. */
  parkingName(spot: AdminSpot): string {
    return typeof spot.parkingId === 'string' ? spot.parkingId : spot.parkingId.name;
  }
}
