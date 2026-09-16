import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../../core/models/api.models';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
}

/**
 * Reusable role-based sidebar.
 * Each dashboard receives the signed-in user's role and gets its own navigation.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly role = input<UserRole>('driver');

  readonly title = computed(() => {
    if (this.role() === 'owner') return 'Owner workspace';
    if (this.role() === 'admin') return 'Admin control';
    return 'Driver menu';
  });

  /** Returns the navigation items that belong to the current role. */
  readonly links = computed<SidebarLink[]>(() => {
    if (this.role() === 'owner') {
      return [
        { label: 'Dashboard', route: '/owner/dashboard', icon: '▦' },
        { label: 'My parkings', route: '/owner/parkings', icon: 'P' },
        { label: 'Bookings', route: '/owner/bookings', icon: 'B' },
        { label: 'Reviews', route: '/owner/reviews', icon: 'R' },
        { label: 'Notifications', route: '/notifications', icon: 'N' },
        { label: 'Profile', route: '/owner/profile', icon: 'U' },
      ];
    }

    if (this.role() === 'admin') {
      return [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '▦' },
        { label: 'Users', route: '/admin/users', icon: 'U' },
        { label: 'Parkings', route: '/admin/parkings', icon: 'P' },
        { label: 'Parking spots', route: '/admin/spots', icon: 'S' },
        { label: 'Bookings', route: '/admin/bookings', icon: 'B' },
        { label: 'Reviews', route: '/admin/reviews', icon: 'R' },
        { label: 'Notifications', route: '/admin/notifications', icon: 'N' },
        { label: 'Settings', route: '/admin/settings', icon: '⚙' },
      ];
    }

    return [
      { label: 'Find parking', route: '/parkings', icon: 'P' },
      { label: 'My bookings', route: '/bookings', icon: 'B' },
      { label: 'Notifications', route: '/notifications', icon: 'N' },
      { label: 'Profile', route: '/profile', icon: 'U' },
    ];
  });
}
