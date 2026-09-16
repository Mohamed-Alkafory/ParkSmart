import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

// Public About page: static marketing content only, no service calls.
// TEMPORARY INLINE NAV/FOOTER: same pattern as the Landing page — local to this
// page only. Another developer owns the shared NavbarComponent/FooterComponent.
// Delete the TEMP blocks in about.component.html and use <app-navbar>/<app-footer>
// once the shared components are ready.
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  /** Mobile hamburger menu state (temporary inline nav). */
  readonly mobileMenuOpen = signal(false);

  /** Current year for the footer copyright line. */
  readonly year = new Date().getFullYear();

  /** Footer "Back to top" action. */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Close the mobile menu after choosing a link. */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
