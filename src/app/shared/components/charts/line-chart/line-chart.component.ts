import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from '../base-chart/base-chart.component';

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartComponent],
  template: `
    <app-base-chart [config]="chartConfig()" type="line" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  data = input.required<LineChartData>();
  height = input<string>('300px');
  title = input<string>('');

  chartConfig = computed<ChartConfiguration>(() => {
    const chartData = this.data();
    const chartTitle = this.title();

    return {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          tension: dataset.tension ?? 0.4,
          borderColor: dataset.borderColor ?? '#3b82f6',
          backgroundColor: dataset.backgroundColor ?? 'rgba(59, 130, 246, 0.1)',
          fill: true,
        })),
      },
      options: {
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
