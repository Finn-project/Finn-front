import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { ProductDetailsComponent } from './product-details.component';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule
  ],
  declarations: [ProductDetailsComponent],
  exports: [ProductDetailsComponent]
})
export class ProductDetailModule { }
