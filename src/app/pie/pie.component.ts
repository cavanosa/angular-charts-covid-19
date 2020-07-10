import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { CovidService } from '../services/covid.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Confirmados', 'Recuperados', 'Activos', 'Defunciones'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: any = [
    {
      backgroundColor: [
        'rgba(200,200,0,0.9)',
        'rgba(0,210,0,0.9)',
        'rgba(255,0,0,0.9)',
        'rgba(136,136,136,0.9)'
      ]
    }
  ];

  countries: string[] = [];
  country: string = null;

  constructor(
    private covidService: CovidService
  ) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  loadData(event: any): void {
    if (this.country) {
      this.clear();
      this.covidService.fromCountry(this.country).subscribe(
        data => {
          const last = data.pop();
          this.pieChartData[0] = last.confirmed;
          this.pieChartData[1] = last.recovered;
          this.pieChartData[2] = last.confirmed - last.recovered - last.deaths;
          this.pieChartData[3] = last.deaths;
        }
      );
    }
  }

  getCountries(): void {
    this.covidService.getAll().subscribe(
      data => {
        this.countries = Object.keys(data);
      }
    );
  }

  clear(): void {
    this.pieChartData = [];
  }

}
