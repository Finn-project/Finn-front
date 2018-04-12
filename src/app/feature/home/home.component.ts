import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url = `${environment.apiUrl}`;
  results: any;
  pk: number;


  constructor(private http: HttpClient, public spinner: SpinnerService) {}

  ngOnInit() {
    const params = new HttpParams()
    .set('page', '1')
    .set('page_size', '5');

      this.http.get<any>(`${this.url}house/`, { params })
        .subscribe(res => {
          this.results = res.results;
        });
  }
  getPk(event) {
    this.pk = event.target.id;
  }

}
  // data = [{
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/500/984',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/1000/400',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/400/900',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/600/600',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/1200/984',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/1200/984',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/1200/984',
  //   location: '서울'
  // }, {
  //   title: 'hi hello',
  //   roomType: '개인실',
  //   price: '65000',
  //   image: 'https://picsum.photos/1200/984',
  //   location: '서울'
  // },
  //   {
  //     title: 'hi hello',
  //     roomType: '개인실',
  //     price: '65000',
  //     image: 'https://picsum.photos/1200/984',
  //     location: '서울'
  //   },
  //   {
  //     title: 'hi hello',
  //     roomType: '개인실',
  //     price: '65000',
  //     image: 'https://picsum.photos/1200/984',
  //     location: '서울'
  //   }
  // ];
