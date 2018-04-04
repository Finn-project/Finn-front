import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  }]
  constructor() { }

  ngOnInit() {
  }

}
