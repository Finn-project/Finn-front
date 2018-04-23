import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { ProductDetailsComponent } from './product-details.component';
import { ReservationComponent } from './reservation/reservation.component';

import { FormsModule } from '@angular/forms';
import { AngularReactDatesModule } from 'angular-react-dates';


@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    FormsModule,
    AngularReactDatesModule.forRoot(),

  ],
  declarations: [ProductDetailsComponent, ReservationComponent],
  exports: [ProductDetailsComponent, ReservationComponent]
})
export class ProductDetailModule { }
