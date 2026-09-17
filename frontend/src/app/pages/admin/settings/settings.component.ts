import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

const STORAGE_KEY = 'parksmart_admin_settings';

interface AdminSettings {
  appName: string;
  contactEmail: string;
  supportPhone: string;
  defaultPricePerHour: number | null;
  maxBookingHours: number | null;
  notifyOnBooking: boolean;
  notifyOnCancellation: boolean;
  reminderBeforeHours: number | null;
}

const DEFAULTS: AdminSettings = {
  appName: 'ParkSmart',
  contactEmail: 'support@parksmart.app',
  supportPhone: '',
  defaultPricePerHour: 20,
  maxBookingHours: 24,
  notifyOnBooking: true,
  notifyOnCancellation: true,
  reminderBeforeHours: 1,
};

// Platform settings page. No backend endpoint exists, so settings persist to localStorage only.
@Component({ selector: 'app-admin-settings', standalone: true, imports: [FormsModule, SidebarComponent, PageHeaderComponent], templateUrl: './settings.component.html' })
export class AdminSettingsComponent implements OnInit {
  private auth = inject(AuthService);

  /** Sidebar role — same source the navbar uses (AuthService.currentUser). */
  readonly role = computed(() => this.auth.currentUser()?.role ?? 'admin');

  readonly appName = signal(DEFAULTS.appName);
  readonly contactEmail = signal(DEFAULTS.contactEmail);
  readonly supportPhone = signal(DEFAULTS.supportPhone);
  readonly defaultPricePerHour = signal<number | null>(DEFAULTS.defaultPricePerHour);
  readonly maxBookingHours = signal<number | null>(DEFAULTS.maxBookingHours);
  readonly notifyOnBooking = signal(DEFAULTS.notifyOnBooking);
  readonly notifyOnCancellation = signal(DEFAULTS.notifyOnCancellation);
  readonly reminderBeforeHours = signal<number | null>(DEFAULTS.reminderBeforeHours);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<AdminSettings>;
      if (saved.appName !== undefined) this.appName.set(saved.appName);
      if (saved.contactEmail !== undefined) this.contactEmail.set(saved.contactEmail);
      if (saved.supportPhone !== undefined) this.supportPhone.set(saved.supportPhone);
      if (saved.defaultPricePerHour !== undefined) this.defaultPricePerHour.set(saved.defaultPricePerHour);
      if (saved.maxBookingHours !== undefined) this.maxBookingHours.set(saved.maxBookingHours);
      if (saved.notifyOnBooking !== undefined) this.notifyOnBooking.set(saved.notifyOnBooking);
      if (saved.notifyOnCancellation !== undefined) this.notifyOnCancellation.set(saved.notifyOnCancellation);
      if (saved.reminderBeforeHours !== undefined) this.reminderBeforeHours.set(saved.reminderBeforeHours);
    } catch {
      // Corrupt storage is ignored; defaults stay in place.
    }
  }

  onSave(): void {
    this.error.set(null);
    this.message.set(null);
    if (!this.appName().trim()) {
      this.error.set('App name is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail().trim())) {
      this.error.set('Contact email looks invalid.');
      return;
    }
    const price = Number(this.defaultPricePerHour());
    const maxHours = Number(this.maxBookingHours());
    if (!Number.isFinite(price) || price < 0) {
      this.error.set('Default price must be zero or more.');
      return;
    }
    if (!Number.isFinite(maxHours) || maxHours < 1) {
      this.error.set('Max booking duration must be at least 1 hour.');
      return;
    }
    const settings: AdminSettings = {
      appName: this.appName().trim(),
      contactEmail: this.contactEmail().trim(),
      supportPhone: this.supportPhone().trim(),
      defaultPricePerHour: price,
      maxBookingHours: maxHours,
      notifyOnBooking: this.notifyOnBooking(),
      notifyOnCancellation: this.notifyOnCancellation(),
      reminderBeforeHours: Number(this.reminderBeforeHours()) || 0,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      this.message.set('Settings saved locally.');
    } catch {
      this.error.set('Could not save settings in this browser.');
    }
  }

  onReset(): void {
    this.appName.set(DEFAULTS.appName);
    this.contactEmail.set(DEFAULTS.contactEmail);
    this.supportPhone.set(DEFAULTS.supportPhone);
    this.defaultPricePerHour.set(DEFAULTS.defaultPricePerHour);
    this.maxBookingHours.set(DEFAULTS.maxBookingHours);
    this.notifyOnBooking.set(DEFAULTS.notifyOnBooking);
    this.notifyOnCancellation.set(DEFAULTS.notifyOnCancellation);
    this.reminderBeforeHours.set(DEFAULTS.reminderBeforeHours);
    this.message.set(null);
    this.error.set(null);
  }
}
