import { Component, input, output } from '@angular/core';

// TODO (team): star rating. Inputs: value (1..5), readonly. Output: rated. Used by parking-card + review pages. POST /api/reviews needs rating 1..5.
@Component({ selector: 'app-rating', standalone: true, templateUrl: './rating.component.html' })
export class RatingComponent {
  readonly value = input(0);
  readonly readonly = input(false);
  readonly rated = output<number>();
}
