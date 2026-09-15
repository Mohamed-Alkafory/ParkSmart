import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking } from '../../core/models/api.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { BookingCardComponent } from '../../shared/components/booking-card/booking-card.component';

/**
 * TEMPORARY development preview for the five reusable UI components.
 * No API calls. Delete this folder + its route when done reviewing.
 */
@Component({
  selector: 'app-components-preview',
  standalone: true,
  imports: [
    RouterLink,
    StatusBadgeComponent,
    StatCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    BookingCardComponent,
  ],
  templateUrl: './components-preview.component.html',
})
export class ComponentsPreviewComponent {
  readonly spotStatuses = ['available', 'booked', 'selected', 'maintenance'];
  readonly bookingStatuses = ['upcoming', 'active', 'completed', 'cancelled'];

  readonly retryMessage = signal('');
  readonly cardEventMessage = signal('');

  readonly activeBooking: Booking = {
    _id: 'preview-active-1',
    userId: 'preview-user',
    parkingId: { _id: 'preview-parking-1', name: 'Downtown Parking', address: '12 Main Street' },
    spotId: { _id: 'preview-spot-1', spotNumber: 'A12' },
    startTime: '2026-09-16T10:00:00',
    durationHours: 2,
    totalPrice: 20,
    status: 'active',
  };

  // 'upcoming' is a display-only status (badge), not a persisted booking status.
  readonly upcomingBooking = {
    _id: 'preview-upcoming-1',
    userId: 'preview-user',
    parkingId: {
      _id: 'preview-parking-2',
      name: 'Airport Terminal Parking',
      address: '5 Airport Road',
    },
    spotId: { _id: 'preview-spot-2', spotNumber: 'B07' },
    startTime: '2026-09-20T14:30:00',
    durationHours: 3,
    totalPrice: 45,
    status: 'upcoming',
  } as unknown as Booking;

  readonly completedBooking: Booking = {
    _id: 'preview-completed-1',
    userId: 'preview-user',
    parkingId: { _id: 'preview-parking-3', name: 'Mall Plaza Parking', address: '88 Center Ave' },
    spotId: { _id: 'preview-spot-3', spotNumber: 'C03' },
    startTime: '2026-09-10T09:00:00',
    durationHours: 1,
    totalPrice: 10,
    status: 'completed',
  };

  readonly cancelledBooking: Booking = {
    _id: 'preview-cancelled-1',
    userId: 'preview-user',
    parkingId: { _id: 'preview-parking-4', name: 'Station Parking', address: '1 Railway Square' },
    spotId: { _id: 'preview-spot-4', spotNumber: 'D11' },
    startTime: '2026-09-08T18:00:00',
    durationHours: 4,
    totalPrice: 60,
    status: 'cancelled',
  };

  onRetry(which: string): void {
    this.retryMessage.set(`Retry clicked (${which})`);
  }

  onCardCancel(id: string): void {
    this.cardEventMessage.set(`Cancel event emitted (${id})`);
  }

  onCardComplete(id: string): void {
    this.cardEventMessage.set(`Complete event emitted (${id})`);
  }
}
