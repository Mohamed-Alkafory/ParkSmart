import { Component, input } from '@angular/core';

/**
 * Empty-list placeholder shown when a parkings()/bookings()/notifications()
 * signal is []. Dumb component: title plus an optional hint line.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly hint = input('');
}
