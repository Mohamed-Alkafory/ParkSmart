import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storage = inject(StorageService);

  readonly email = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSocialLogin(provider: 'google' | 'facebook'): void {
    const base = `${environment.backendUrl}/api/auth`;
    window.location.href = `${base}/${provider}`;
  }

  onSubmit(): void {
    const emailInput = this.email().trim();

    if (!emailInput || !this.password()) {
      this.error.set('Please enter your email and password.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.login(emailInput, this.password()).subscribe({
      next: (res) => {
        if (!res.data) {
          this.error.set('Unexpected server response. Please try again.');
          this.loading.set(false);
          return;
        }
        this.storage.setToken(res.data.token);
        this.storage.setUser(res.data.user);
        this.auth.currentUser.set(res.data.user);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? '/parkings');
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}