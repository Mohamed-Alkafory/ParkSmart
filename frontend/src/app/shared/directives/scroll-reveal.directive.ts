import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

export interface ScrollRevealOptions {
  /** Stagger delay in ms before the transition starts. */
  delay?: number;
  /** If true (default), animate once and stop observing. */
  once?: boolean;
}

/**
 * Lightweight scroll-reveal directive (IntersectionObserver, no libraries).
 * Adds `.is-visible` when the host enters the viewport; base `.reveal` styles
 * live in global styles.css (opacity-0 + translate-y, 600ms ease-out).
 *
 * Usage:
 *   <div appScrollReveal>...</div>
 *   <div [appScrollReveal]="{ delay: 150 }">...</div>
 *   <div [appScrollReveal]="{ delay: 150, once: false }">...</div>
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  readonly options = input<ScrollRevealOptions | number | string | undefined>(undefined, {
    alias: 'appScrollReveal',
  });

  private readonly host = inject(ElementRef);

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const el = this.host.nativeElement as HTMLElement;
    const { delay, once } = this.parseOptions();

    el.classList.add('reveal');
    if (delay > 0) {
      el.style.setProperty('transition-delay', `${delay}ms`);
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            if (once) this.observer?.unobserve(el);
          } else if (!once) {
            el.classList.remove('is-visible');
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private parseOptions(): { delay: number; once: boolean } {
    const raw = this.options();
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return { delay: Math.max(0, raw), once: true };
    }
    if (raw && typeof raw === 'object') {
      return {
        delay: Math.max(0, raw.delay ?? 0),
        once: raw.once ?? true,
      };
    }
    return { delay: 0, once: true };
  }
}
