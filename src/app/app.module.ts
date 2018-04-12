import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HostRegisterModule } from './feature/host-register/host-register.module';

import { CoreModule } from './core/core.module';
import { HomeComponent } from './feature/home/home.component';
import { AuthService, AuthModule } from './core/login/auth';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from './shared/shared.module';

import { ProductDetailsComponent } from './feature/product-details/product-details.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HostRegisterModule,
    CoreModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCxXp7uUGDn2FCzjDg5j5Z-AQlCxcTLOdM',
      libraries: ["places"]
    }),
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
