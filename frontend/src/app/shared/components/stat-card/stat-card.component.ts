import { Component, input } from '@angular/core';

/**
 * Dashboard metric tile used by owner/dashboard + admin/dashboard.
 * Dumb component: label, value, and an optional hint line.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly hint = input('');
}
