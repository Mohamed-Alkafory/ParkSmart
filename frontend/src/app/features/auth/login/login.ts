import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  // TODO 1: create signals for email, password, loading, error using signal().
  readonly error = signal<string | null>(null);

  onSubmit(): void {
    // TODO 2: validate email + password are non-empty; set error signal if not.
    // TODO 3: call this.auth.login(email, password) and subscribe().
    // TODO 4: on next (ApiResponse<{ token, user }>): save token to
    //   localStorage 'parksmart_token', set currentUser signal, navigate to '/parkings'.
    // TODO 5: on error: set error signal from err.error?.message. Use RxJS subscribe({ next, error }).
    throw new Error('Not implemented — see TODOs 2-5');
  }
}
