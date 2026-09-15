import { Component, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';

// TODO (team): mirror features/notifications. GET /api/notifications; PATCH /:id/read; PATCH /read-all. Render <app-notification-item> list. Guard: authGuard.
@Component({ selector: 'app-driver-notifications', standalone: true, templateUrl: './notifications.component.html' })
export class DriverNotificationsComponent {
  private notifs = inject(NotificationsService);
  readonly items = signal<AppNotification[]>([]);
  // TODO: ngOnInit getMine() + markOneRead()/markAllRead() per notifications-list TODOs 1-3.
  load(): void { void this.notifs; throw new Error('Not implemented'); }
}
