import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO (team): view/edit own profile. Backend: GET /api/users/me? — check routes/user.routes.js; else display AuthService.currentUser + StorageService user. Edit name/phone via PATCH /api/users/:id. Guard: authGuard.
@Component({ selector: 'app-driver-profile', standalone: true, imports: [FormsModule], templateUrl: './profile.component.html' })
export class DriverProfileComponent {
  readonly error = signal<string | null>(null);
  // TODO: user signal + load() + onSave().
}
