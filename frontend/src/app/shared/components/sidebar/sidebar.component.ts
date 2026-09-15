import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// TODO (team): role-based links — driver (home/search/bookings), owner (dashboard/my-parking/bookings), admin (dashboard/users). Follow navbar.ts pattern (isLoggedIn/isOwner computed).
@Component({ selector: 'app-sidebar', standalone: true, imports: [RouterLink, RouterLinkActive], templateUrl: './sidebar.component.html' })
export class SidebarComponent {
  readonly role = input<string>('driver');
}
