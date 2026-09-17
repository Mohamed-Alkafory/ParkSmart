import { Component, input, output } from '@angular/core';
import { Spot } from '../../../core/models/api.models';

/**
 * Reusable spot card.
 * It displays the spot number and status, and emits its ID when it is selectable.
 */
@Component({
  selector: 'app-parking-spot',
  standalone: true,
  templateUrl: './parking-spot.component.html',
})
export class ParkingSpotComponent {
  readonly spot = input.required<Spot>();
  readonly selectable = input(false);
  /** Highlights the spot as the driver's current pick (navy). */
  readonly selected = input(false);
  readonly select = output<string>();

  /** Sends the selected spot ID to the parent component. */
  chooseSpot(): void {
    const currentSpot = this.spot();

    if (this.selectable() && currentSpot.status === 'available' && currentSpot._id) {
      this.select.emit(currentSpot._id);
    }
  }
}
