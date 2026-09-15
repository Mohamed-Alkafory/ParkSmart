import { Component, input } from '@angular/core';

// TODO (team): empty list placeholder. Inputs: title, hint. Use when parkings()/bookings()/notifications() signal is [].
@Component({ selector: 'app-empty-state', standalone: true, templateUrl: './empty-state.component.html' })
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly hint = input('');
}
