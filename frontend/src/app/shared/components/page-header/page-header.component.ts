import { Component, input } from '@angular/core';

/**
 * Shared gradient page-header banner used at the top of every sidebar-paired
 * page (Owner + Admin dashboards, users, parkings, spots, bookings, reviews,
 * notifications, settings).
 *
 * Uses the project's primary blue palette (#003366 → #0060C0) so all dashboard
 * pages open with the same visual rhythm. Optional actions (badges, buttons)
 * can be projected into the right-hand slot.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  /** Small uppercase kicker above the title (e.g. "Overview"). */
  readonly eyebrow = input('');
  /** Main page title (e.g. "Admin dashboard"). */
  readonly title = input.required<string>();
  /** One-line description rendered below the title. */
  readonly subtitle = input('');
}
