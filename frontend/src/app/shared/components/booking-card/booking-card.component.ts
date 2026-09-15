import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Booking } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

/**
 * Dumb booking card used by driver/my-bookings, owner/bookings, and
 * admin/bookings pages. Shows parking, spot, time, and price, plus the
 * status badge. For active bookings it emits cancel/complete with the
 * booking id; the parent page calls BookingsService.updateStatus().
 */
@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  templateUrl: './booking-card.component.html',
})
export class BookingCardComponent {
  readonly booking = input.required<Booking>();
  readonly cancel = output<string>();
  readonly complete = output<string>();

  readonly parkingName = computed(() => {
    const parking = this.booking().parkingId;
    return typeof parking === 'string' ? 'Parking' : parking.name;
  });

  readonly parkingAddress = computed(() => {
    const parking = this.booking().parkingId;
    return typeof parking === 'string' ? '' : parking.address;
  });

  readonly spotLabel = computed(() => {
    const spot = this.booking().spotId;
    return typeof spot === 'string' ? '' : spot.spotNumber;
  });

  readonly isActive = computed(() => this.booking().status === 'active');

  onCancel(): void {
    const id = this.booking()._id;
    if (id) this.cancel.emit(id);
  }

  onComplete(): void {
    const id = this.booking()._id;
    if (id) this.complete.emit(id);
  }
}
