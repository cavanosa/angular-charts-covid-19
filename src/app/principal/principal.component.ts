import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CovidService } from '../services/covid.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Confirmados' },
    { data: [], label: 'Recuperados' },
    { data: [], label: 'Activos' },
    { data: [], label: 'Defunciones' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'yellow',
      backgroundColor: 'rgba(200,200,0,0.3)',
    },
    {
      borderColor: 'green',
      backgroundColor: 'rgba(0,210,0,0.3)',
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(136, 136, 136,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  locale = 'es';

  countries: string[] = [];
  country: string = null;

  dateInit: Date;
  dateEnd: Date;
  minCovDate: Date;
  maxCovDate: Date;

  constructor(
    private localeService: BsLocaleService,
    private covidService: CovidService,
    private datePipe: DatePipe
  ) {
    this.localeService.use(this.locale);
    this.minCovDate = new Date('2020-1-22');
    this.maxCovDate = new Date();
    this.maxCovDate.setDate(this.maxCovDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.getCountries();
    // this.covidService.twoDates('Spain', new Date('2020-1-22'), new Date('2020-1-24')).subscribe(
    //   data => {
    //     console.log(data);
    //   }
    // );
  }

  getCountries(): void {
    this.covidService.getAll().subscribe(
      data => {
        this.countries = Object.keys(data);
      }
    );
  }

  loadData(event: any): void {
    if (this.country && this.dateInit && this.dateEnd) {
      forkJoin([
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.confirmed))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.recovered))),
        this.covidService.twoDates
          (this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.confirmed - val.recovered - val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.deaths))),
        this.covidService.twoDates
          (this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => this.datePipe.transform(val.date, 'dd/MM')))),
      ]).subscribe((
        [data0, data1, data2, data3, data4]
      ) => {
        this.lineChartData[0].data = data0;
        this.lineChartData[1].data = data1;
        this.lineChartData[2].data = data2;
        this.lineChartData[3].data = data3;
        this.lineChartLabels = data4;
      });
    }
  }

}
