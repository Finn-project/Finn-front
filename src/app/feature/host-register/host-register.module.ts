import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room-basic-info/room.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [RoomComponent],
  exports: [RoomComponent]
})
export class HostRegisterModule { }
