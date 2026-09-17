import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

// Owner add-parking page. POST /api/parkings { name, address, pricePerHour, lat, lng }.
// On success navigates to the new parking's spots page so the owner can add spots.
@Component({ selector: 'app-owner-add-parking', standalone: true, imports: [FormsModule, RouterLink, SidebarComponent, PageHeaderComponent, ImageUploadComponent], templateUrl: './add-parking.component.html' })
export class OwnerAddParkingComponent {
  private parkingsSvc = inject(ParkingsService);
  private router = inject(Router);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  readonly name = signal('');
  readonly address = signal('');
  readonly pricePerHour = signal<number | null>(null);
  readonly lat = signal<number | null>(null);
  readonly lng = signal<number | null>(null);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  /** Photo picked before the parking exists — uploaded right after creation. */
  readonly pendingImage = signal<File | null>(null);

  /** Keeps the picked file for the post-create upload (preview is instant). */
  onImageSelected(file: File): void {
    this.pendingImage.set(file);
  }

  onSubmit(): void {
    const payload = this.validatedPayload();
    if (!payload || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);
    this.parkingsSvc.create(payload).subscribe({
      next: (res) => {
        const id = res.data?._id;
        const file = this.pendingImage();
        if (id && file) {
          // Parking exists now — attach the photo, then continue.
          this.parkingsSvc.uploadImage(id, file).subscribe({
            next: () => {
              this.submitting.set(false);
              void this.router.navigate(['/owner/parkings', id, 'spots']);
            },
            error: (uploadErr) => {
              this.submitting.set(false);
              this.error.set(
                uploadErr?.error?.message ??
                  'Parking created, but the photo could not be uploaded. You can add it from Edit parking.',
              );
              void this.router.navigate(['/owner/parkings', id, 'spots']);
            },
          });
          return;
        }
        this.submitting.set(false);
        void this.router.navigate(
          id ? ['/owner/parkings', id, 'spots'] : ['/owner/parkings'],
        );
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not create the parking.');
        this.submitting.set(false);
      },
    });
  }

  private validatedPayload(): {
    name: string;
    address: string;
    pricePerHour: number;
    lat: number;
    lng: number;
  } | null {
    const name = this.name().trim();
    const address = this.address().trim();
    const price = Number(this.pricePerHour());
    const lat = Number(this.lat());
    const lng = Number(this.lng());
    if (!name || !address) {
      this.error.set('Name and address are required.');
      return null;
    }
    if (!Number.isFinite(price) || price <= 0) {
      this.error.set('Price per hour must be a positive number.');
      return null;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      this.error.set('Latitude and longitude are required.');
      return null;
    }
    return { name, address, pricePerHour: price, lat, lng };
  }
}
