import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PrincipalComponent } from './principal/principal.component';
import { BottomComponent } from './bottom/bottom.component';
import { FooterComponent } from './footer/footer.component';
import { PieComponent } from './pie/pie.component';
import { DonutComponent } from './donut/donut.component';
import { BarComponent } from './bar/bar.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// datepicker
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

// ng2-charts
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    PrincipalComponent,
    BottomComponent,
    FooterComponent,
    PieComponent,
    DonutComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
