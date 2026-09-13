import { Component, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [],
  templateUrl: './notifications-list.html',
})
export class NotificationsList {
  private notificationsService = inject(NotificationsService);

  readonly notifications = signal<AppNotification[]>([]);

  // TODO 1: in ngOnInit: call notificationsService.getMine()
  //   → GET /api/notifications, assign to notifications signal.
  // TODO 2: add markOneRead(id): call notificationsService.markAsRead(id)
  //   → PATCH /api/notifications/:id/read, then update that item's isRead in the signal.
  // TODO 3: add markAllRead(): call notificationsService.markAllAsRead()
  //   → PATCH /api/notifications/read-all, then set all isRead = true in the signal.
}
