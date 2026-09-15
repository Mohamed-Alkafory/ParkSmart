import { Component, input, output } from '@angular/core';
import { Spot } from '../../../core/models/api.models';

// TODO (team): spot tile. Inputs: spot, selectable. Output: select. Color by status (available=emerald, booked=slate). Used by driver/select-spot + owner/parking-spots.
@Component({ selector: 'app-parking-spot', standalone: true, templateUrl: './parking-spot.component.html' })
export class ParkingSpotComponent {
  readonly spot = input.required<Spot>();
  readonly selectable = input(false);
  readonly select = output<string>();
}
