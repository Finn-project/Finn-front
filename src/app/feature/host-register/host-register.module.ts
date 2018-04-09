import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room-basic-info/room.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule
  ],
  declarations: [RoomComponent],
  exports: [RoomComponent]
})
export class HostRegisterModule { }
