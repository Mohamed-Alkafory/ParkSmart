import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';

/**
 * OAuth callback component.
 *
 * The backend redirects to this page after a successful Google/Facebook
 * login with `?token=...&user=...` query params. We store the auth data
 * through the existing StorageService/AuthService flow (same keys/format
 * as normal email/password login), then navigate to the app home page.
 */
@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  templateUrl: './oauth-callback.html',
})
export class OAuthCallback implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private storage = inject(StorageService);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const rawUser = params['user'];

      if (!token || !rawUser) {
        this.error.set(
          params['error'] ?? 'OAuth login failed. Please try again.',
        );
        setTimeout(() => this.router.navigate(['/login']), 1800);
        return;
      }

      try {
        const user = JSON.parse(rawUser);
        this.storage.setToken(token);
        this.storage.setUser(user);
        this.auth.currentUser.set(user);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? '/parkings');
      } catch {
        this.error.set('Invalid OAuth response. Please try again.');
        setTimeout(() => this.router.navigate(['/login']), 1800);
      }
    });
  }
}