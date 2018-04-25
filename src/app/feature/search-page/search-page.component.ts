import { Component, OnInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { MapsAPILoader } from '@agm/core';
import { SearchHouseService } from '../../core/service/search-house.service';
import { environment } from '../../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../core/service/util.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  zoom = 15;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private searchHouse: SearchHouseService,
    public router: Router,
    public utils: UtilService) {
    console.log(this.searchHouse.getlatitude);
    console.log(this.searchHouse.getlongitude);
  }

  url = `${environment.apiUrl}`;
  next: any;
  previous: any;
  results: any;
  latitude: number;
  longitude: number;
  pk: number;

  neLat: number;
  neLng: number;;
  swLat: number;
  swLng: number;
  notFound: number;
  ngOnInit() {

    this.route.queryParams
      .subscribe(res => {
        console.log('params', res.latitude)
        this.latitude = +res.latitude
        this.longitude = +res.longitude
        this.neLat = res.neLat;
        this.neLng = res.neLng;
        this.swLat = res.swLat;
        this.swLng = res.swLng;

        const params = new HttpParams()
          .set('page', '1')
          .set('page_size', '12')
          .set('ne_lat', `${this.neLat}`)
          .set('ne_lng', `${this.neLng}`)
          .set('sw_lat', `${this.swLat}`)
          .set('sw_lng', `${this.swLng}`);

        this.http.get<any>(`${this.url}house/?fields=pk,host,img_cover_thumbnail,house_type
    ,name,price_per_night,latitude,longitude`, { params })
          .subscribe(res => {
            console.log('response receive')
            this.next = res ? res.next : null;
            this.previous = res ? res.previous : null;
            this.notFound = res ? res.count : null;
            this.results = res ? res.results : null;
            console.log('result', this.results);
          });
      });
  }

  getPk(event) {
    this.pk = event.target.id;
    console.log('aaa', event.target.id);
  }

  next_page() {
    console.log('test next', this.next);
    this.http.get<any>(`${this.next}`)
      .subscribe(res => {
        this.results = res.results;
        this.next = res.next;
        this.previous = res.previous;
      });
  }

  previous_page() {
    console.log('test previous', this.previous);
    this.http.get<any>(`${this.previous}`)
      .subscribe(res => {
        this.results = res.results;
        this.next = res.next;
        this.previous = res.previous;
      });
  }

  boundsChange(latLngBounds): void {
    // console.log('fdfdf', this.test)
    // console.log('bounds changed' + latLngBounds);
    const neLat = latLngBounds.getNorthEast().lat();
    const neLng = latLngBounds.getNorthEast().lng();
    const swLat = latLngBounds.getSouthWest().lat();
    const swLng = latLngBounds.getSouthWest().lng();

    // console.log('북동 위도', neLat);
    // console.log('북동 경도', neLng);
    // console.log('남서 위도', swLat);
    // console.log('남서 경도', swLng);
    this.neLat = neLat;
    this.neLng = neLng;
    this.swLat = swLat;
    this.swLng = swLng;
  }
  mouseup() {
    this.neLat = this.neLat;
    this.neLng = this.neLng;
    this.swLat = this.swLat;
    this.swLng = this.swLng;
    console.log('북동 위도', this.neLat);
    console.log('북동 경도', this.neLng);
    console.log('남서 위도', this.swLat);
    console.log('남서 경도', this.swLng);
    const params = new HttpParams()
      .set('page', '1')
      .set('page_size', '12')
      .set('ne_lat', `${this.neLat}`)
      .set('ne_lng', `${this.neLng}`)
      .set('sw_lat', `${this.swLat}`)
      .set('sw_lng', `${this.swLng}`);

    this.http.get<any>(`${this.url}house/?fields=pk,host,img_cover_thumbnail,house_type
    ,name,price_per_night,latitude,longitude`, { params })
      .subscribe(res => {
        console.log('response receive')
        this.next = res ? res.next : null;
        this.previous = res ? res.previous : null;
        this.notFound = res ? res.count : null;
        this.results = res ? res.results : null;
        console.log('result', this.results)
      });
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
// {
//   title: 'hi hello',
//   roomType: '개인실',
//   price: '65000',
//   image: 'https://picsum.photos/1200/984',
//   location: '서울'
// },
// {
//   title: 'hi hello',
//   roomType: '개인실',
//   price: '65000',
//   image: 'https://picsum.photos/1200/984',
//   location: '서울'
// }
// ];
