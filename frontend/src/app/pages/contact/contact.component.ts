import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

// Public Contact page: form UI with client-side validation only — no backend calls.
// TEMPORARY INLINE NAV/FOOTER: same pattern as the Landing page — local to this
// page only. Another developer owns the shared NavbarComponent/FooterComponent.
// Delete the TEMP blocks in contact.component.html and use <app-navbar>/<app-footer>
// once the shared components are ready.
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  /** Current year for the footer copyright line. */
  readonly year = new Date().getFullYear();

  /** Contact form fields. */
  readonly name = signal('');
  readonly email = signal('');
  readonly subject = signal('');
  readonly message = signal('');

  /** Inline feedback (no API call is made). */
  readonly formError = signal<string | null>(null);
  readonly sent = signal(false);

  /** Footer "Back to top" action. */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Validate locally and show an inline success message (preview only). */
  onSubmit(): void {
    this.formError.set(null);
    if (!this.name().trim()) {
      this.formError.set('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())) {
      this.formError.set('Please enter a valid email address.');
      return;
    }
    if (!this.subject().trim()) {
      this.formError.set('Please enter a subject.');
      return;
    }
    if (this.message().trim().length < 10) {
      this.formError.set('Please write a message of at least 10 characters.');
      return;
    }
    this.sent.set(true);
  }

  /** Start another message. */
  onWriteAnother(): void {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.sent.set(false);
    this.formError.set(null);
  }
}
