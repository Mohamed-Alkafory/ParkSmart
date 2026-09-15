import { Component, input, output } from '@angular/core';

/**
 * Error box shown when a component's error() signal is set.
 * Displays the message plus a Retry button that re-emits to the parent.
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly message = input('Something went wrong');
  readonly retry = output<void>();
}
