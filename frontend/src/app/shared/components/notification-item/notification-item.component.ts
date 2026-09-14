import { Component, input, output } from '@angular/core';
import { AppNotification } from '../../../core/models/api.models';

// TODO (team): row for notifications lists. Input notification; output read. Show isRead badge + mark-read button calling NotificationsService.markAsRead().
@Component({ selector: 'app-notification-item', standalone: true, templateUrl: './notification-item.component.html' })
export class NotificationItemComponent {
  readonly notification = input.required<AppNotification>();
  readonly read = output<string>();
}
