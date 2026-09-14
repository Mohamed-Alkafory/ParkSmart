import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { USER_KEY } from '../../../core/guards/owner.guard';
import { TOKEN_KEY } from '../../../core/guards/auth.guard';
import { User } from '../../../core/models/api.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isOwner = computed(() => this.currentUser()?.role === 'owner');

  ngOnInit(): void {
    if (this.currentUser()) {
      return;
    }
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        if (user?.email) {
          this.auth.currentUser.set(user);
        }
      }
    } catch {
      // corrupted storage — ignore, user stays logged out
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // storage unavailable — continue with in-memory logout
    }
    this.auth.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
