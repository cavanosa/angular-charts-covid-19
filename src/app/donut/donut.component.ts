import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, MultiDataSet } from 'ng2-charts';
import { CovidService } from '../services/covid.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent implements OnInit {
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
  };
  public doughnutChartLabels: Label[] = ['Confirmados', 'Recuperados', 'Activos', 'Defunciones'];
  public doughnutChartData: MultiDataSet = [
    [],
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartPlugins = [];
  public doughnutChartColors: any = [
    {
      backgroundColor: [
        'rgba(200,200,0,0.9)',
        'rgba(0,210,0,0.9)',
        'rgba(255,0,0,0.9)',
        'rgba(136,136,136,0.9)'
      ]
    },
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
  country1: string = null;
  country2: string = null;

  constructor(
    private covidService: CovidService
  ) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  loadData(event: any): void {
    if (this.country1 && this.country2) {
      this.clear();
      forkJoin([
        this.covidService.fromCountry(this.country1),
        this.covidService.fromCountry(this.country2)
      ]).subscribe(
        ([data1, data2]) => {
          const last1 = data1.pop();
          const last2 = data2.pop();
          this.doughnutChartData[0][0] = last1.confirmed;
          this.doughnutChartData[0][1] = last1.recovered;
          this.doughnutChartData[0][2] = last1.confirmed - last1.recovered - last1.deaths;
          this.doughnutChartData[0][3] = last1.deaths;
          // data 2
          this.doughnutChartData[1][0] = last2.confirmed;
          this.doughnutChartData[1][1] = last2.recovered;
          this.doughnutChartData[1][2] = last2.confirmed - last2.recovered - last2.deaths;
          this.doughnutChartData[1][3] = last2.deaths;
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
    this.doughnutChartData = [];
    this.doughnutChartData.push([]);
    this.doughnutChartData.push([]);
  }

}
