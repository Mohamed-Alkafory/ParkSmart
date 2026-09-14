import { Component, inject, signal } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { AppNotification } from '../../../core/models/api.models';

// TODO (team): same as driver notifications (GET /api/notifications, PATCH read). Owner gets booking alerts. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-notifications', standalone: true, templateUrl: './notifications.component.html' })
export class OwnerNotificationsComponent {
  private notifs = inject(NotificationsService);
  readonly items = signal<AppNotification[]>([]);
  // TODO: copy driver/notifications TODOs.
  load(): void { void this.notifs; throw new Error('Not implemented'); }
}
