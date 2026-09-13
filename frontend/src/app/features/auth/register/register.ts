import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  // TODO 1: create signals for name, email, password, phone, loading, error.
  readonly error = signal<string | null>(null);

  onSubmit(): void {
    // TODO 2: validate name + email + password are present (phone optional).
    //   Note backend password rule (auth.service.js): min 6 chars with upper + lower + digit + special.
    // TODO 3: call this.auth.register(name, email, password, phone?) and subscribe().
    // TODO 4: on next: navigate to '/login' (backend register returns user only, NO token).
    // TODO 5: on error: set error signal. Use subscribe({ next, error }).
    throw new Error('Not implemented — see TODOs 2-5');
  }
}
