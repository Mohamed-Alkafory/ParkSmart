import { Component, computed, input, output } from '@angular/core';
import { AppNotification } from '../../../core/models/api.models';

type NotificationVariant = 'success' | 'info' | 'alert' | 'notice';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  templateUrl: './notification-item.component.html',
})
export class NotificationItemComponent {
  readonly notification = input.required<AppNotification>();
  readonly read = output<string>();

  readonly variant = computed<NotificationVariant>(() => {
    const n = this.notification();
    const title = (n.title ?? '').toLowerCase();
    if (n.type === 'cancelled') return 'alert';
    if (n.type === 'reminder') return 'notice';
    if (title.includes('confirm') || title.includes('success')) return 'success';
    if (title.includes('cancel') || title.includes('alert')) return 'alert';
    return 'info';
  });

  readonly timeLabel = computed(() => formatRelativeTime(this.notification().createdAt));

  onSelect(): void {
    const id = this.notification()._id;
    if (!this.notification().isRead && id) {
      this.read.emit(id);
    }
  }
}

function formatRelativeTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}