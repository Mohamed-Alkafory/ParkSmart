import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';

// TODO (team): mirror features/parkings/parking-create. POST /api/parkings { name, address, pricePerHour, lat, lng } (owner only). On success -> my-parking. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-add-parking', standalone: true, imports: [FormsModule], templateUrl: './add-parking.component.html' })
export class OwnerAddParkingComponent {
  private parkingsSvc = inject(ParkingsService);
  private router = inject(Router);
  readonly error = signal<string | null>(null);
  // TODO: 5 field signals + onSubmit() per parking-create TODOs 2-4.
  onSubmit(): void { void this.parkingsSvc; void this.router; throw new Error('Not implemented'); }
}
