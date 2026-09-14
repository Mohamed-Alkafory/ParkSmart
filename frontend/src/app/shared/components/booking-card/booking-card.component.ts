import { Component, input, output } from '@angular/core';
import { Booking } from '../../../core/models/api.models';

// TODO (team): dumb card. Inputs: booking. Outputs: cancel, complete. Parent (my-bookings pages) calls BookingsService.updateStatus(). Show <app-status-badge>.
@Component({ selector: 'app-booking-card', standalone: true, templateUrl: './booking-card.component.html' })
export class BookingCardComponent {
  readonly booking = input.required<Booking>();
  readonly cancel = output<string>();
  readonly complete = output<string>();
}
