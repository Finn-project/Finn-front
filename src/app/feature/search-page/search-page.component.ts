import { Component, OnInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  latitude = 12.123123;
  longitude = 12.23213;
  zoom = 15;
  data = [{
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/500/984',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/1000/400',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/400/900',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/600/600',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/1200/984',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/1200/984',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/1200/984',
    location: '서울'
  }, {
    title: 'hi hello',
    roomType: '개인실',
    price: '65000',
    image: 'https://picsum.photos/1200/984',
    location: '서울'
  },
    {
      title: 'hi hello',
      roomType: '개인실',
      price: '65000',
      image: 'https://picsum.photos/1200/984',
      location: '서울'
    },
    {
      title: 'hi hello',
      roomType: '개인실',
      price: '65000',
      image: 'https://picsum.photos/1200/984',
      location: '서울'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}