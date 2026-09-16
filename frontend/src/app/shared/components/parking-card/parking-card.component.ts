import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parking } from '../../../core/models/api.models';
import { RatingComponent } from '../rating/rating.component';

/**
 * Reusable parking card used by lists and search results.
 * It receives parking data only; fetching data remains the parent page's job.
 */
@Component({
  selector: 'app-parking-card',
  standalone: true,
  imports: [RouterLink, RatingComponent],
  templateUrl: './parking-card.component.html',
})
export class ParkingCardComponent {
  readonly parking = input.required<Parking>();
  /** Route prefix for the details link. Defaults to the public page; driver flow passes '/driver/parkings'. */
  readonly linkPrefix = input<string>('/parkings');
}
