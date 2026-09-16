import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParkingsService } from '../../../core/services/parkings.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  private parkings = inject(ParkingsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // :id route param (parking) + ?spotId= query param (from select-spot).
  readonly id = input<string>('');
  readonly spotId = input<string>('');

  readonly form = this.fb.group({
    startTime: ['', Validators.required],
    durationHours: [1, [Validators.required, Validators.min(1)]],
  });

  readonly pricePerHour = signal<number | null>(null);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly durationValue = signal(1);

  readonly estimatedTotal = computed(() => {
    const price = this.pricePerHour();
    if (price === null) return null;
    return price * this.durationValue();
  });

  ngOnInit(): void {
    const parkingId = this.id();
    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }

    this.form.get('durationHours')?.valueChanges.subscribe((v) => {
      this.durationValue.set(typeof v === 'number' ? v : Number(v) || 0);
    });

    this.parkings.getById(parkingId).subscribe({
      next: (res) => this.pricePerHour.set(res.data?.pricePerHour ?? null),
      error: () => this.pricePerHour.set(null),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const parkingId = this.id();
    if (!parkingId) {
      this.error.set('Parking ID is missing.');
      return;
    }

    const rawStart: string = this.form.get('startTime')?.value ?? '';
    const duration = Number(this.form.get('durationHours')?.value);
    const startIso = new Date(rawStart).toISOString();
    if (Number.isNaN(Date.parse(startIso))) {
      this.error.set('Please choose a valid start time.');
      return;
    }

    // No POST here — the confirmation page creates the booking on Confirm.
    // Forward the form values as query params (actual names: id/spotId + form controls).
    void this.router.navigate(['/bookings/confirmation'], {
      queryParams: {
        parkingId,
        ...(this.spotId() ? { spotId: this.spotId() } : {}),
        startTime: startIso,
        durationHours: duration,
      },
    });
  }
}
