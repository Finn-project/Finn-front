import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../feature/home/home.component';
import { RoomComponent } from '../feature/host-register/room-basic-info/room.component';
import { ProfileComponent } from '../feature/profile/profile.component';
import { ProfileEditComponent } from '../feature/profile/profile-edit/profile-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'host',
    component: RoomComponent
  },
  {
    path: 'user',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: '/user/edit',  pathMatch: 'full' },
      { path: 'edit', component: ProfileEditComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
