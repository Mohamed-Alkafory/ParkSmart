import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';

/**
 * Notifications page: Notifications in the design flow (shared by all roles).
 * GET /api/notifications, PATCH /api/notifications/:id/read, PATCH /read-all.
 */
@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notifications-list.html',
})
export class NotificationsList implements OnInit {
  private notificationsService = inject(NotificationsService);

  readonly notifications = signal<AppNotification[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly actingAll = signal(false);

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.notificationsService.getMine().subscribe({
      next: (res) => {
        this.notifications.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load notifications.');
        this.loading.set(false);
      },
    });
  }

  markOneRead(id?: string): void {
    if (!id) return;
    const current = this.notifications().find((n) => n._id === id);
    if (!current || current.isRead) return;
    this.notificationsService.markAsRead(id).subscribe({
      next: (res) => {
        const updated = res.data ?? { ...current, isRead: true };
        this.notifications.update((list) =>
          list.map((n) => (n._id === id ? updated : n)),
        );
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not mark notification as read.');
      },
    });
  }

  markAllRead(): void {
    if (this.actingAll() || this.unreadCount() === 0) return;
    this.actingAll.set(true);
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
        this.actingAll.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not mark all as read.');
        this.actingAll.set(false);
      },
    });
  }
}
