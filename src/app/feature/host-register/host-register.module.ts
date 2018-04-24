import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room-basic-info/room.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  declarations: [RoomComponent],
  exports: [RoomComponent]
})
export class HostRegisterModule { }
