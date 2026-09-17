import { Component, computed, effect, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export type ChartWidgetType = 'bar' | 'doughnut' | 'pie';

/** Project color tokens: primary blue, success green, warning amber, error red, slate. */
export const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#64748b'];
export const STATUS_COLORS = {
  active: '#10b981',
  completed: '#2563eb',
  cancelled: '#ef4444',
} as const;

/**
 * Thin Chart.js wrapper for dashboard charts.
 * Rebuilds the chart whenever type/labels/data/colors change.
 */
@Component({
  selector: 'app-chart-widget',
  standalone: true,
  templateUrl: './chart-widget.component.html',
})
export class ChartWidgetComponent implements OnDestroy {
  readonly type = input<ChartWidgetType>('bar');
  readonly labels = input<string[]>([]);
  readonly data = input<number[]>([]);
  readonly title = input('');
  readonly caption = input('');
  /** Unit word shown in tooltips, e.g. "bookings", "users", "EGP". */
  readonly unit = input('');
  readonly colors = input<string[]>(CHART_COLORS);
  /** Shown in place of the canvas when there is nothing to plot. */
  readonly emptyText = input('No data yet');

  /** True when at least one value is positive — zeros-only also counts as empty. */
  readonly hasData = computed(() => {
    const data = this.data();
    return data.length > 0 && data.some((v) => (v ?? 0) > 0);
  });

  private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const canvas = this.canvasRef();
      const labels = this.labels();
      const data = this.data();
      if (!canvas) return;

      this.chart?.destroy();
      this.chart = null;
      if (!this.hasData()) return;

      const palette = this.colors();
      const backgroundColor = data.map((_, i) => palette[i % palette.length]);

      const unit = this.unit();
      this.chart = new Chart(canvas.nativeElement, {
        type: this.type(),
        data: {
          labels,
          datasets: [{ data, backgroundColor, borderWidth: 1, borderColor: '#ffffff' }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: this.type() === 'bar' ? 'top' : 'bottom',
              align: 'center',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle',
                color: '#475569',
                font: { size: 12, weight: 500 },
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: '#0f172a',
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              padding: 12,
              cornerRadius: 10,
              displayColors: true,
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label ?? ctx.dataset.label ?? '';
                  const raw = ctx.parsed;
                  const value = typeof raw === 'number' ? raw : (raw as { y?: number })?.y ?? ctx.raw;
                  return unit ? ` ${label}: ${value} ${unit}` : ` ${label}: ${value}`;
                },
              },
            },
          },
          scales:
            this.type() === 'bar'
              ? { y: { beginAtZero: true, ticks: { precision: 0 } } }
              : undefined,
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}
