import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { resolveImageUrl } from '../../../core/utils/image-url';

// Owner edit-parking page. Prefills from GET /api/parkings/:id,
// saves with PUT /api/parkings/:id (lat+lng sent together), then back to /owner/parkings.
@Component({ selector: 'app-edit-parking', standalone: true, imports: [FormsModule, RouterLink, SidebarComponent, PageHeaderComponent, ImageUploadComponent], templateUrl: './edit-parking.component.html' })
export class EditParkingComponent implements OnInit {
  private parkingsSvc = inject(ParkingsService);
  private router = inject(Router);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  readonly id = input<string>('');

  readonly name = signal('');
  readonly address = signal('');
  readonly pricePerHour = signal<number | null>(null);
  readonly lat = signal<number | null>(null);
  readonly lng = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly imageUploading = signal(false);
  readonly storedImagePath = signal<string | null>(null);

  /** Resolved parking photo URL (null = show the placeholder). */
  readonly imageSrc = computed(() => resolveImageUrl(this.storedImagePath()));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const parkingId = this.id();
    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.parkingsSvc.getById(parkingId).subscribe({
      next: (res) => {
        const p = res.data;
        if (!p) {
          this.error.set('Parking not found.');
        } else {
          this.name.set(p.name);
          this.address.set(p.address);
          this.pricePerHour.set(p.pricePerHour);
          const coords = p.location.coordinates;
          this.lng.set(coords[0]);
          this.lat.set(coords[1]);
          this.storedImagePath.set(p.imageUrl ?? null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load the parking.');
        this.loading.set(false);
      },
    });
  }

  /** Uploads a new parking photo immediately on file selection. */
  onImageSelected(file: File): void {
    const parkingId = this.id();
    if (!parkingId || this.imageUploading()) return;

    this.imageUploading.set(true);
    this.error.set(null);
    this.parkingsSvc.uploadImage(parkingId, file).subscribe({
      next: (res) => {
        this.storedImagePath.set(res.data?.imageUrl ?? null);
        this.imageUploading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not upload the photo.');
        this.imageUploading.set(false);
      },
    });
  }

  onSubmit(): void {
    const parkingId = this.id();
    const name = this.name().trim();
    const address = this.address().trim();
    const price = Number(this.pricePerHour());
    const lat = Number(this.lat());
    const lng = Number(this.lng());
    if (!parkingId || this.saving()) return;
    if (!name || !address) {
      this.error.set('Name and address are required.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      this.error.set('Price per hour must be a positive number.');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      this.error.set('Latitude and longitude are required.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.parkingsSvc.update(parkingId, { name, address, pricePerHour: price, lat, lng }).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/owner/parkings']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not update the parking.');
        this.saving.set(false);
      },
    });
  }
}
