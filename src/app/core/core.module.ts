import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreRoutingModule } from './core-routing.module';

import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';

@NgModule({
  imports: [
    CommonModule, CoreRoutingModule
  ],
  declarations: [HeaderComponent, LoginComponent, SignUpComponent],
  exports: [HeaderComponent, LoginComponent, SignUpComponent, RouterModule]
})
export class CoreModule { }
