import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parking } from '../../../core/models/api.models';

// TODO (team): dumb presentational card. Input parking; template shows name/address/pricePerHour/rating + routerLink to /parkings/:id. Used by driver/home + search-results + owner/my-parking.
@Component({ selector: 'app-parking-card', standalone: true, imports: [RouterLink], templateUrl: './parking-card.component.html' })
export class ParkingCardComponent {
  readonly parking = input.required<Parking>();
}
