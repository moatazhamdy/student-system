import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from '../base-chart/base-chart.component';

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartComponent],
  template: `
    <app-base-chart [config]="chartConfig()" type="bar" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  data = input.required<BarChartData>();
  height = input<string>('300px');
  title = input<string>('');
  horizontal = input<boolean>(false);

  chartConfig = computed<ChartConfiguration>(() => {
    const chartData = this.data();
    const chartTitle = this.title();
    const isHorizontal = this.horizontal();

    return {
      type: isHorizontal ? 'bar' : 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor ?? [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#ec4899',
          ],
          borderColor: dataset.borderColor ?? 'transparent',
          borderWidth: 1,
        })),
      },
      options: {
        indexAxis: isHorizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: !!chartTitle,
            text: chartTitle,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    };
  });
}
