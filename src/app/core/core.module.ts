import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CoreComponent, HeaderComponent, LoginComponent],
  exports: [CoreComponent, HeaderComponent, LoginComponent]
})
export class CoreModule { }
