import { Component, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';

// TODO (team): own notifications (GET /api/notifications, PATCH read). Broadcast-to-all needs new backend endpoint. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-notifications', standalone: true, templateUrl: './notifications.component.html' })
export class AdminNotificationsComponent {
  private notifs = inject(NotificationsService);
  readonly items = signal<AppNotification[]>([]);
  // TODO: load() + markOneRead()/markAllRead().
  load(): void { void this.notifs; throw new Error('Not implemented'); }
}
