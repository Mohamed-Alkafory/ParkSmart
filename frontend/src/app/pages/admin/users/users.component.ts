import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO (team): user mgmt. Backend routes/user.routes.js — confirm admin-only GET /api/users + PUT/DELETE /api/users/:id. Table with role filter + delete. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-users', standalone: true, imports: [FormsModule], templateUrl: './users.component.html' })
export class AdminUsersComponent {
  readonly users = signal<never[]>([]);
  // TODO: load() + changeRole() + remove().
  load(): void { throw new Error('Not implemented'); }
}
