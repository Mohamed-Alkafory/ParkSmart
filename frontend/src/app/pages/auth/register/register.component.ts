import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// TODO (team): mirror features/auth/register. POST /api/auth/register { name, email, password, phone? } -> user (NO token). Then navigate /login. Password rule: upper+lower+digit+special, 6+ chars.
@Component({ selector: 'app-register-page', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './register.component.html' })
export class RegisterPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly error = signal<string | null>(null);
  // TODO: name/email/password/phone/loading signals + onSubmit() per features/auth/register TODOs 2-5.
  onSubmit(): void { void this.auth; void this.router; throw new Error('Not implemented'); }
}
