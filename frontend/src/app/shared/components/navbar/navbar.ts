import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private storage = inject(StorageService);
  private notificationsService = inject(NotificationsService);

  readonly currentUser = this.auth.currentUser;
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isOwner = computed(() => this.currentUser()?.role === 'owner');
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly notificationsLink = computed(() =>
    this.isAdmin() ? '/admin/notifications' : '/notifications',
  );
  readonly profileLink = computed(() =>
    this.isAdmin()
      ? '/admin/profile'
      : this.isOwner()
        ? '/owner/profile'
        : '/profile',
  );
  readonly menuOpen = signal(false);
  readonly hasUnread = signal(false);
  private readonly unreadUserId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      const id = user ? (user._id ?? user.email) : null;
      if (id && this.unreadUserId() !== id) {
        this.unreadUserId.set(id);
        this.loadUnread();
      } else if (!user) {
        this.unreadUserId.set(null);
        this.hasUnread.set(false);
      }
    });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.refreshUnread());
  }

  ngOnInit(): void {
    if (this.currentUser()) {
      return;
    }
    const user = this.storage.getUser();
    if (user) {
      this.auth.currentUser.set(user);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private refreshUnread(): void {
    if (!this.isLoggedIn() || this.router.url.startsWith('/notifications')) {
      return;
    }
    this.loadUnread();
  }

  private loadUnread(): void {
    this.notificationsService.getMine().subscribe({
      next: (res) => this.hasUnread.set((res.data ?? []).some((n) => !n.isRead)),
      // Errors are intentionally ignored: the badge is decorative and must not
      // break navigation for authenticated users.
    });
  }
}