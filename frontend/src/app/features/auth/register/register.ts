import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Mirrors the backend rule in auth.service.js: min 6 chars with upper,
// lower, digit and special character.
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly name = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly phone = signal('');
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    const nameInput = this.name().trim();
    const emailInput = this.email().trim();
    const phoneInput = this.phone().trim();

    if (!nameInput || !emailInput || !this.password()) {
      this.error.set('Please fill in your name, email and password.');
      return;
    }

    if (!PASSWORD_REGEX.test(this.password())) {
      this.error.set(
        'Password must be at least 6 characters and include an uppercase letter, a lowercase letter, a number and a special character.',
      );
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth
      .register(nameInput, emailInput, this.password(), phoneInput || undefined)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
          this.loading.set(false);
        },
      });
  }
}