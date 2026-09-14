import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';

@Component({
  selector: 'app-parking-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './parking-create.html',
})
export class ParkingCreate {
  private parkingsService = inject(ParkingsService);
  private router = inject(Router);

  // TODO 1: create signals for name, address, pricePerHour, lat, lng, error.
  //   All 5 fields are required by backend POST /api/parkings.
  readonly error = signal<string | null>(null);

  onSubmit(): void {
    // TODO 2: validate all fields present; set error signal if missing.
    // TODO 3: call parkingsService.create({ name, address, pricePerHour, lat, lng }) and subscribe().
    //   Protected: owner role only (ownerGuard on the route).
    // TODO 4: on next: navigate to '/parkings'. On error: set error signal.
    throw new Error('Not implemented — see TODOs 2-4');
  }
}
