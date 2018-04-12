import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../feature/home/home.component';
import { RoomComponent } from '../feature/host-register/room-basic-info/room.component';
import { ProductDetailsComponent } from '../feature/product-details/product-details.component';
import { AuthGuard } from './login/auth';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'host',
    component: RoomComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'detail/:pk',
    component: ProductDetailsComponent,
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
