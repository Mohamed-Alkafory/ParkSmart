import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/api.models';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type RoleFilter = 'all' | UserRole;

const PAGE_SIZE = 10;

/**
 * Admin users management. GET /api/users (no server pagination — sliced locally),
 * role change via PATCH /:id { role } (there is no PATCH /:id/role endpoint),
 * DELETE /:id. Self-delete is blocked.
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, FormsModule, PagerComponent, SidebarComponent, PageHeaderComponent],
  templateUrl: './users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private usersSvc = inject(UsersService);
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly users = signal<User[]>([]);
  readonly search = signal('');
  readonly roleFilter = signal<RoleFilter>('all');
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly actingId = signal<string | null>(null);

  readonly roles: UserRole[] = ['driver', 'owner', 'admin'];

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const role = this.roleFilter();
    return this.users().filter((u) => {
      if (role !== 'all' && u.role !== role) return false;
      if (!term) return true;
      return (
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );

  readonly paged = computed(() => {
    const page = Math.min(this.page(), this.totalPages());
    return this.filtered().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersSvc.getAll().subscribe({
      next: (res) => {
        this.users.set(res.data ?? []);
        this.page.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not load users.');
        this.loading.set(false);
      },
    });
  }

  onFilterChange(): void {
    this.page.set(1);
  }

  changeRole(user: User, role: UserRole): void {
    const id = user._id;
    if (!id || role === user.role || this.actingId()) return;
    if (!confirm(`Change ${user.name}'s role to ${role}?`)) return;
    this.actingId.set(id);
    this.notice.set(null);
    this.usersSvc.updateRole(id, role).subscribe({
      next: (res) => {
        const updated = res.data ?? { ...user, role };
        this.users.update((list) => list.map((u) => (u._id === id ? updated : u)));
        this.notice.set(`${user.name} is now ${role}.`);
        this.actingId.set(null);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not change the role.');
        this.actingId.set(null);
      },
    });
  }

  isSelf(id?: string): boolean {
    const current = this.auth.currentUser();
    return !!id && !!current?._id && current._id === id;
  }

  remove(user: User): void {
    const id = user._id;
    if (!id || this.actingId()) return;
    if (this.isSelf(id)) {
      this.error.set('You cannot delete your own account.');
      return;
    }
    if (!confirm(`Delete user ${user.name} (${user.email})?`)) return;
    this.actingId.set(id);
    this.notice.set(null);
    this.usersSvc.delete(id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u._id !== id));
        this.notice.set('User deleted.');
        this.actingId.set(null);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Could not delete the user.');
        this.actingId.set(null);
      },
    });
  }
}
