import { Component, computed, input, output } from '@angular/core';

/**
 * Reusable client-side pager for admin tables.
 * The backend list endpoints have no ?page=&limit= support, so pages slice
 * their filtered arrays locally and render this pager underneath.
 */
@Component({
  selector: 'app-pager',
  standalone: true,
  templateUrl: './pager.component.html',
})
export class PagerComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly pageChange = output<number>();

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(1, Math.min(current - 2, Math.max(1, total - 4)));
    return Array.from({ length: Math.min(5, total) }, (_, i) => start + i).filter(
      (p) => p >= 1 && p <= total,
    );
  });

  go(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
