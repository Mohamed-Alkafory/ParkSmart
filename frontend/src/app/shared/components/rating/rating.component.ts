import { Component, input, output } from '@angular/core';

/**
 * Reusable five-star rating component.
 * Read-only mode displays a rating; interactive mode emits the selected value.
 */
@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.component.html',
})
export class RatingComponent {
  readonly value = input(0);
  readonly readonly = input(false);
  readonly rated = output<number>();
  readonly stars = [1, 2, 3, 4, 5];

  /** Emits a valid rating only when the component is interactive. */
  selectRating(star: number): void {
    if (!this.readonly() && star >= 1 && star <= 5) {
      this.rated.emit(star);
    }
  }
}
