import { Component, input } from '@angular/core';

// TODO (team): colored badge for BookingStatus (active|completed|cancelled) + SpotStatus (available|booked). Map status -> Tailwind class.
@Component({ selector: 'app-status-badge', standalone: true, templateUrl: './status-badge.component.html' })
export class StatusBadgeComponent {
  readonly status = input.required<string>();
}
