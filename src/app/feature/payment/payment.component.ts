import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/login/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  url = `${environment.apiUrl}`;
  value = this.getUser();
  price = this.value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  result = (this.value.price * this.value.date).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  constructor(private auth: AuthService, private http: HttpClient, public router: Router) { }
  // get test() {
  //   return this.auth.test;
  // }
  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const Data = JSON.parse(localStorage.getItem('house_data'));
    return Data;
  }
  testest() {

    console.log(typeof (this.value.check_in_date));
    console.log(typeof Number(this.value.check_out_date));

    const In = this.value.check_in_date;
    const Out = this.value.check_out_date;
    const data = {
      check_in_date: In,
      check_out_date: Out,
      house: this.value.house,
      guest_num: this.value.guest_num,
      payment_type: 'DE',
    };

    const headers = new HttpHeaders()
      .set('Authorization', `token ${this.auth.getToken()}`);

    console.log(this.auth.getToken());
    console.log(data);
    console.log(headers);
    this.http.post(`${this.url}reservation/`, data, { headers } )
      .subscribe(() => {
        this.router.navigate(['']),
        localStorage.removeItem('house_data');
      });
}


}

