import { Component, input, output } from '@angular/core';

// TODO (team): error box. Input message; output retry. Use when components set error() signal (see login TODO 5).
@Component({ selector: 'app-error-state', standalone: true, templateUrl: './error-state.component.html' })
export class ErrorStateComponent {
  readonly message = input('Something went wrong');
  readonly retry = output<void>();
}
