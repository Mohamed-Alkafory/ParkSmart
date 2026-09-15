import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO (team): confirm-then-pay step. Input booking id; show summary (fetch via GET /api/bookings/my + find, backend has no GET by id); Confirm button -> booking-success. Guard: authGuard.
@Component({ selector: 'app-booking-confirmation', standalone: true, imports: [RouterLink], templateUrl: './booking-confirmation.component.html' })
export class BookingConfirmationComponent {
  readonly id = input<string>('');
  // TODO: load summary + confirm().
}
