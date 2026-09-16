import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface HowItWorksStep {
  badgeClass: string;
  title: string;
  text: string;
}

// Public marketing landing page: static content only, no service calls.
// TEMPORARY INLINE NAV/FOOTER: the nav + footer below are local to this page only.
// Another developer owns the shared NavbarComponent/FooterComponent — do NOT move
// this markup there. When the shared components are ready, delete the clearly-marked
// TEMP NAV / TEMP FOOTER blocks in landing.component.html and use <app-navbar>/<app-footer>.
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  /** Mobile hamburger menu state (temporary inline nav). */
  readonly mobileMenuOpen = signal(false);

  /** "How it works" audience tab: drivers or owners. */
  readonly audience = signal<'drivers' | 'owners'>('drivers');

  /** Current year for the footer copyright line. */
  readonly year = new Date().getFullYear();

  /** "How it works" steps (rendered with staggered reveals). */
  readonly driverSteps: HowItWorksStep[] = [
    {
      badgeClass: 'bg-blue-600',
      title: 'Search',
      text: 'Find nearby parking, compare prices, ratings, and live availability.',
    },
    {
      badgeClass: 'bg-emerald-600',
      title: 'Book',
      text: 'Pick your spot and confirm your booking in seconds — no waiting.',
    },
    {
      badgeClass: 'bg-violet-600',
      title: 'Park',
      text: 'Arrive, park, and manage everything from your bookings page.',
    },
  ];

  readonly ownerSteps: HowItWorksStep[] = [
    {
      badgeClass: 'bg-emerald-600',
      title: 'List',
      text: 'Add your space with photos, pricing, and availability in minutes.',
    },
    {
      badgeClass: 'bg-blue-600',
      title: 'Manage',
      text: 'Track spots, bookings, and reviews from your owner dashboard.',
    },
    {
      badgeClass: 'bg-amber-500',
      title: 'Earn',
      text: 'Turn empty space into steady income with every booking.',
    },
  ];

  /** Footer "Back to top" action. */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Close the mobile menu after choosing a link. */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
