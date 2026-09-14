import { Component, input } from '@angular/core';

// TODO (team): dashboard metric tile. Inputs: label, value, hint. Used by owner/dashboard + admin/dashboard.
@Component({ selector: 'app-stat-card', standalone: true, templateUrl: './stat-card.component.html' })
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly hint = input('');
}
