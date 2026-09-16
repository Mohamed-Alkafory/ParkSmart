import { Component, effect, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
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
  readonly colors = input<string[]>(CHART_COLORS);

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
      if (data.length === 0) return;

      const palette = this.colors();
      const backgroundColor = data.map((_, i) => palette[i % palette.length]);

      this.chart = new Chart(canvas.nativeElement, {
        type: this.type(),
        data: {
          labels,
          datasets: [{ data, backgroundColor, borderWidth: 1, borderColor: '#ffffff' }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: this.type() === 'bar' ? 'top' : 'bottom' } },
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
