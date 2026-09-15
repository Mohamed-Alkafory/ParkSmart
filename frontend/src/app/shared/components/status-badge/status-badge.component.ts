import { Component, computed, input } from '@angular/core';

/**
 * Colored badge for booking statuses (upcoming/active/completed/cancelled)
 * and spot statuses (available/booked/selected/maintenance).
 * Colors follow the Status System in design-reference.jpeg.
 */
const STATUS_STYLES: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  booked: 'bg-red-100 text-red-800',
  selected: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-slate-200 text-slate-600',
  upcoming: 'bg-blue-100 text-blue-800',
  active: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-slate-200 text-slate-600',
  cancelled: 'bg-red-100 text-red-800',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  readonly badgeClass = computed(
    () => STATUS_STYLES[this.status().toLowerCase()] ?? 'bg-slate-100 text-slate-600',
  );

  readonly label = computed(() => {
    const value = this.status();
    return value.charAt(0).toUpperCase() + value.slice(1);
  });
}
