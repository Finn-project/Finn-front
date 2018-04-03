import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HeaderComponent, LoginComponent, SignUpComponent],
  exports: [HeaderComponent, LoginComponent, SignUpComponent]
})
export class CoreModule { }
