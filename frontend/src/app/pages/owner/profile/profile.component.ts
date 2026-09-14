import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO (team): same as driver profile (view/edit name/phone via PATCH /api/users/:id). Guards: authGuard + ownerGuard.
@Component({ selector: 'app-owner-profile', standalone: true, imports: [FormsModule], templateUrl: './profile.component.html' })
export class OwnerProfileComponent {
  readonly error = signal<string | null>(null);
  // TODO: user signal + load() + onSave().
}
