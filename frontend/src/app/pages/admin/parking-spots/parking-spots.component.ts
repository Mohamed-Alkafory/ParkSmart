import { Component, signal } from '@angular/core';

// TODO (team): all spots overview. Backend: GET /api/spots (admin) with parking populated — either add GET /api/spots or iterate parkings -> GET /api/spots/parking/:id. Table + status toggle (PUT /:id/status). Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-spots', standalone: true, templateUrl: './parking-spots.component.html' })
export class AdminSpotsComponent {
  readonly spots = signal<never[]>([]);
  // TODO: load() + toggleStatus().
  load(): void { throw new Error('Not implemented'); }
}
