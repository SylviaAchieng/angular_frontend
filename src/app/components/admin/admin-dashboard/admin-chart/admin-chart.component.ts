import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './admin-chart.component.html',
  styleUrl: './admin-chart.component.css'
})
export class AdminChartComponent {
  barChartOptions: ChartOptions = {
    responsive: true,
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      { data: [65, 59, 80, 81], label: 'Projects', backgroundColor: '#0d3b50' },
      { data: [28, 48, 40, 19], label: 'Revenue', backgroundColor: '#ffcc00' }
    ]
  };

  barChartType: ChartType = 'bar';

}
