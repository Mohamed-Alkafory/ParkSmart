import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO (team): edit parking. Input id. NOTE backend has NO PUT /api/parkings/:id yet — needs Member 2 to add updateParking service+controller+route first (see backend parkings.service TODO) — needs Member 2 to add updateParking service+controller+route first (see backend parkings.service TODO). Until then prefill from GET /api/parkings list. Guards: authGuard + ownerGuard.
@Component({ selector: 'app-edit-parking', standalone: true, imports: [FormsModule], templateUrl: './edit-parking.component.html' })
export class EditParkingComponent {
  readonly id = input<string>('');
  readonly error = signal<string | null>(null);
  // TODO: load() prefill + onSubmit() (blocked on backend PUT).
  onSubmit(): void { void this.id; throw new Error('Not implemented — needs backend PUT /api/parkings/:id'); }
}
