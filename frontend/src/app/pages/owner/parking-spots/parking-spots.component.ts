import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpotsService } from '../../../core/services/spots.service';
import { Spot, SpotStatus } from '../../../core/models/api.models';
import { ParkingSpotComponent } from '../../../shared/components/parking-spot/parking-spot.component';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

/**
 * Owner spot management page.
 * Loads the parking spots and lets the owner create, update, and delete them.
 */
@Component({
  selector: 'app-owner-spots',
  standalone: true,
  imports: [FormsModule, RouterLink, ParkingSpotComponent, SidebarComponent, PageHeaderComponent],
  templateUrl: './parking-spots.component.html',
})
export class OwnerParkingSpotsComponent implements OnInit {
  private spotsSvc = inject(SpotsService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  // The router provides this value from /owner/parkings/:id/spots.
  readonly id = input<string>('');
  readonly spots = signal<Spot[]>([]);
  readonly newSpotNumber = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly message = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  /** Gets all spots that belong to the selected parking. */
  load(): void {
    const parkingId = this.id();

    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.spotsSvc.getByParking(parkingId).subscribe({
      next: (response) => this.spots.set(response.data ?? []),
      error: (err) => {
        this.error.set(this.getErrorMessage(err, 'Could not load parking spots.'));
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  /** Adds a new spot to the current owner's parking. */
  addSpot(): void {
    const parkingId = this.id();
    const spotNumber = this.newSpotNumber().trim();

    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }

    if (!spotNumber) {
      this.error.set('Please enter a spot number.');
      return;
    }

    this.saving.set(true);
    this.clearFeedback();

    this.spotsSvc.create(parkingId, spotNumber).subscribe({
      next: (response) => {
        if (response.data) {
          const createdSpot = response.data;
          this.spots.update((items) => [...items, createdSpot]);
        }
        this.newSpotNumber.set('');
        this.message.set('Spot added successfully.');
      },
      error: (err) => {
        this.error.set(this.getErrorMessage(err, 'Could not add the spot.'));
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }

  /** Changes a spot between available and booked. */
  changeStatus(spotId: string | undefined, status: SpotStatus): void {
    if (!spotId) return;

    this.clearFeedback();
    this.spotsSvc.updateStatus(spotId, status).subscribe({
      next: (response) => {
        if (response.data) {
          const updatedSpot = response.data;
          this.spots.update((items) =>
            items.map((item) => (item._id === spotId ? updatedSpot : item)),
          );
        }
        this.message.set('Spot status updated successfully.');
      },
      error: (err) => this.error.set(this.getErrorMessage(err, 'Could not update the spot.')),
    });
  }

  /** Deletes an available spot after owner confirmation. */
  removeSpot(spotId: string | undefined): void {
    if (!spotId || !confirm('Delete this spot?')) return;

    this.clearFeedback();
    this.spotsSvc.delete(spotId).subscribe({
      next: () => {
        this.spots.update((items) => items.filter((item) => item._id !== spotId));
        this.message.set('Spot deleted successfully.');
      },
      error: (err) => this.error.set(this.getErrorMessage(err, 'Could not delete the spot.')),
    });
  }

  private clearFeedback(): void {
    this.error.set(null);
    this.message.set(null);
  }

  private getErrorMessage(error: any, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
