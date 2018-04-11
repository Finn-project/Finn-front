import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/login/auth';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  url = `${environment.apiUrl}`;
  constructor(public auth: AuthService, private http: HttpClient, public spinner: SpinnerService) { }
  img_profile: any;
  value: any;
  user: any;
  zoom = 15;


  latitude: any;
  longitude: any;
  ngOnInit() {
    this.img_check();
    this.user = this.auth.getUser();
    console.log(this.latitude);
    this.spinner.show();
  }
  img_check() {
    this.http.get<any>(`${this.url}house/1`)
      .subscribe(res => {
        if (this.user.img_profile == null) {
          this.img_profile = '../../../assets/img/defaultProfileImg.png';
          console.log(res);
          console.log(res.facilities);
          this.latitude = +res.latitude;
          this.longitude = +res.longitude;
          console.log(typeof this.latitude);
        } else {
          this.img_profile = (res.host.images[1]);
        }
        this.value = res;
        this.spinner.hide();
      });
  }
}
