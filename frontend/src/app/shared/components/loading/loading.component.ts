import { Component, input } from '@angular/core';

// TODO (team): spinner. Input message. Use wherever components have loading() signal (see parking-list TODO 1).
@Component({ selector: 'app-loading', standalone: true, templateUrl: './loading.component.html' })
export class LoadingComponent {
  readonly message = input('Loading…');
}
