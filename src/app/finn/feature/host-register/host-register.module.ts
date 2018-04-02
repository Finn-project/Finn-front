import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room-basic-info/room.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RoomComponent],
  exports: [RoomComponent]
})
export class HostRegisterModule { }
