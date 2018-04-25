import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room-basic-info/room.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SharedModule } from '../../shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderComponent } from './room-basic-info/calendar-header.component';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CalendarModule.forRoot()
  ],
  declarations: [
  RoomComponent,
  CalendarHeaderComponent
  ],
  exports: [RoomComponent]
})
export class HostRegisterModule { }
