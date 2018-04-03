import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
// import { RoomComponent } from './finn/feature/host-register/room-basic-info/room.component';
import { HostRegisterModule } from './feature/host-register/host-register.module';

import { CoreModule } from './core/core.module';


@NgModule({
  declarations: [
    AppComponent,
    // RoomComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HostRegisterModule,
    CoreModule
    // RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
