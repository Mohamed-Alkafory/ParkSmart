import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// TODO (team): platform settings (prices, defaults). No backend endpoint yet — propose POST /api/settings or keep local-only via StorageService. Guards: authGuard + roleGuard(['admin']).
@Component({ selector: 'app-admin-settings', standalone: true, imports: [FormsModule], templateUrl: './settings.component.html' })
export class AdminSettingsComponent {
  readonly error = signal<string | null>(null);
  // TODO: settings signal + onSave().
  onSave(): void { throw new Error('Not implemented — needs backend settings endpoint'); }
}
