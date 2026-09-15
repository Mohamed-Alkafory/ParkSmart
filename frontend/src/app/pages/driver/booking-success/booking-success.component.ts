import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO (team): static success screen. Input booking id; links to my-bookings + booking-details. No service calls. Guard: authGuard.
@Component({ selector: 'app-booking-success', standalone: true, imports: [RouterLink], templateUrl: './booking-success.component.html' })
export class BookingSuccessComponent {
  readonly id = input<string>('');
}
