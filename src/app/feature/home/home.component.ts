import { Component, OnInit, HostListener } from '@angular/core';
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

  hi: any;
  next: any;
  previous: any;


  constructor(private http: HttpClient, public spinner: SpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    const params = new HttpParams()
    .set('page', '1')
    .set('page_size', '8');

      this.http.get<any>(`${this.url}house/`, { params })
        .subscribe(res => {
          this.next = res.next;
          this.previous = res.previous;
          this.results = res.results;
          console.log(this.results);
          this.spinner.hide();
          if (this.results.img_cover == null){
            this.results.img_cover = './../../../assets/img/default-image.png';
          }
        });
  }
  getPk(event) {
    this.pk = event.target.id;
    console.log('aaa', event.target.id);
  }
  test() {
    console.log(this.next);

    this.http.get<any>(`${this.next}`)
      .subscribe(res => {
        this.spinner.hide();

        this.results = [...this.results, ...res.results];

      });
    }

/*scroll window and get data */
  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;
    if (offset === height) {
      this.test();
    }
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
