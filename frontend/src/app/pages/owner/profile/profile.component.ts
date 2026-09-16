import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { USER_KEY } from '../../../core/guards/owner.guard';
import { User } from '../../../core/models/api.models';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

/** Owner profile page: reads and updates the signed-in owner's name and phone. */
@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
})
export class OwnerProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private usersService = inject(UsersService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'owner');

  readonly user = signal<User | null>(null);
  readonly name = signal('');
  readonly phone = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly message = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  /** Loads fresh owner data using the ID saved after login. */
  load(): void {
    const storedUser = this.readStoredUser();
    const currentUser = this.auth.currentUser() ?? storedUser;

    if (!currentUser?._id) {
      this.error.set('Profile data is unavailable. Please log in again.');
      return;
    }

    this.setFormUser(currentUser);
    this.loading.set(true);
    this.error.set(null);

    this.usersService.getById(currentUser._id).subscribe({
      next: (response) => {
        if (response.data) this.setFormUser(response.data);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load your profile.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  /** Saves only name and phone, which are allowed for an owner account. */
  onSave(): void {
    const currentUser = this.user();
    const cleanName = this.name().trim();

    if (!currentUser?._id || !cleanName) {
      this.error.set('Name is required.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.message.set(null);

    this.usersService.updateProfile(currentUser._id, cleanName, this.phone().trim()).subscribe({
      next: (response) => {
        if (response.data) {
          this.setFormUser(response.data);
          this.auth.currentUser.set(response.data);
          this.storeUser(response.data);
        }
        this.message.set('Profile updated successfully.');
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not update your profile.');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }

  private setFormUser(user: User): void {
    this.user.set(user);
    this.name.set(user.name);
    this.phone.set(user.phone ?? '');
  }

  private readStoredUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as User | null;
    } catch {
      return null;
    }
  }

  private storeUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // The API update succeeded even if browser storage is unavailable.
    }
  }
}
