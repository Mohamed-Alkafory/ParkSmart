import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';
import { NotificationItemComponent } from '../../../shared/components/notification-item/notification-item.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    NotificationItemComponent,
    LoadingComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './notifications-list.html',
})
export class NotificationsList implements OnInit {
  private notificationsService = inject(NotificationsService);

  readonly notifications = signal<AppNotification[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly hasUnread = computed(() => this.notifications().some((n) => !n.isRead));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.notificationsService.getMine().subscribe({
      next: (res) => this.notifications.set(res.data ?? []),
      error: (err) => this.error.set(extractMessage(err)),
      complete: () => this.loading.set(false),
    });
  }

  markOneRead(id: string): void {
    this.notificationsService.markAsRead(id).subscribe({
      next: () =>
        this.notifications.update((items) =>
          items.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        ),
      error: (err) => this.error.set(extractMessage(err)),
    });
  }

  markAllRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () =>
        this.notifications.update((items) =>
          items.map((n) => ({ ...n, isRead: true })),
        ),
      error: (err) => this.error.set(extractMessage(err)),
    });
  }
}

function extractMessage(err: unknown): string {
  const e = err as { error?: { message?: string } } | undefined;
  return e?.error?.message ?? 'Something went wrong while loading notifications.';
}