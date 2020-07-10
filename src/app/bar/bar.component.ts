import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CovidService } from '../services/covid.service';
import { Observable, forkJoin } from 'rxjs';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Activos' },
    { data: [], label: 'Recuperados' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255,0,0,0.9)'
    },
    {
      backgroundColor: 'rgba(0,210,0,0.9)'
    }
  ];

  countries: string[] = [];
  country: string = null;

  lastDays: number[] = [];

  constructor(
    private covidService: CovidService
  ) { }

  ngOnInit(): void {
    this.getCountries();
    this.obtainLastDays();
  }

  loadData(event: any): void {
    if (this.country) {
      this.clear();
      const obs: Observable<any>[] = new Array();
      for (let i = 0; i < this.lastDays.length; i++) {
        const date = new Date();
        date.setDate(this.lastDays[i]);
        date.setMonth(i);
        date.setHours(0, 0, 0, 0);
        let obsAct: Observable<any> = new Observable();
        obsAct = this.covidService.twoDates(this.country, date, date);
        obs.push(obsAct);
      }
      forkJoin(obs).subscribe(
        data => {
          data.forEach((res, i) => {
            this.barChartData[0].data[i] = res[0].confirmed - res[0].recovered - res[0].deaths;
            this.barChartData[1].data[i] = res[0].recovered;
            this.barChartLabels.push(MONTHS[i]);
          });
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

  obtainLastDays(): void {
    const month = new Date().getMonth();
    let date = new Date(new Date().getFullYear(), month + 1, 0);
    for (let i = 1; i <= month; i++) {
      date = new Date(new Date().getFullYear(), i, 0);
      this.lastDays.push(date.getDate());
    }
  }

  clear(): void {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartLabels = [];
  }

}
