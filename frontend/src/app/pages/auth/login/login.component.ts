import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// TODO (team): mirror features/auth/login/login.ts pattern. POST /api/auth/login { email, password } -> { token, user }. Save parksmart_token + parksmart_user, set currentUser, navigate /parkings.
@Component({ selector: 'app-login-page', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly error = signal<string | null>(null);
  // TODO: email/password/loading signals + onSubmit() per features/auth/login TODOs 2-5.
  onSubmit(): void { void this.auth; void this.router; throw new Error('Not implemented'); }
}
