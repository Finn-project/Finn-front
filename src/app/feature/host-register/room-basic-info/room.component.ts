import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type PageState = 'room' | 'bedroom' | 'bathroom' | 'location' | 'amentities' | 'spaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  amentities = [
    { name: 'essentials', content: '필수품목' },
    { name: 'wifi', content: '무선인터넷' },
    { name: 'shampoo', content: '샴푸' },
    { name: 'tv', content: 'TV' },
    { name: 'heater', content: '난방' },
    { name: 'ac', content: '에어컨' },
    { name: 'breakfast', content: '조식' },
    { name: 'iron', content: '다리미' },
    { name: 'hair-dryer', content: '헤어드라이어' },
  ];

  spaces = [
    { name: 'pool', content: '수영장' },
    { name: 'kitchen', content: '주방' },
    { name: 'washer', content: '세탁기' },
    { name: 'parking-lot', content: '주차장' },
    { name: 'elevator', content: '엘리베이터' },
  ];

  locationFields = [
    { name: '국가', type: 'nation', content: '' },
    { name: '시/도', type: 'state', content: '' },
    { name: '시/군', type: 'city', content: '' },
    { name: '도로명/건물번호/건물이름', type: 'street', content: '' },
    { name: '우편번호', type: 'zipcode', content: '' }
  ];

  // 현재 페이지의 상태
  pageStates: PageState[] = ['room', 'bedroom', 'bathroom', 'location', 'amentities', 'spaces'];

  stateCount = 0;
  currentState: PageState = this.pageStates[this.stateCount];

  roomTypes = ['개인실', '다인실'];

  roomCapacities = ['최대 1명 숙박 가능', '최대 2명 숙박 가능',
                    '최대 3명 숙박 가능', '최대 4명 숙박 가능'];

  roomCategories = ['주택', '아파트', '별채', '호텔'];

  bedroomTypes = ['싱글', '더블', '킹', '퀸', '아기침대' ];

  bedroomCount = 0;

  bathroomCount = 0;

  latitude = 37.49794199999999;
  longitude = 127.027621;
  zoom = 15;
  formattedLocation = '';
  zipcode = '';
  zipcodeLength = 0;
  location: string;

  constructor(public http: HttpClient) { }

  findLocation(location: string) {
    this.location = location;
    this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: 'AIzaSyCxXp7uUGDn2FCzjDg5j5Z-AQlCxcTLOdM'
      }
    })
      .subscribe(response => {

        console.dir(response);
        console.dir(response.results);

        response.results[0].address_components.map(el => {
          return console.dir(el.types);
        });
        const resLength = response.results[0].address_components.length;
        for (let i = 0; i < 5; i++) {
          this.locationFields[i].content = '';
        }
        for (let j = 0; j < resLength; j++ ) {
          this.locationFields[j].content = response.results[0].address_components[j].long_name;
        }
        this.zipcodeLength = response.results[0].address_components.length;
        this.formattedLocation = response.results[0].formatted_address;
        this.zipcode = response.results[0].address_components[this.zipcodeLength - 1].long_name;
        this.latitude = response.results[0].geometry.location.lat;
        this.longitude = response.results[0].geometry.location.lng;
      });
  }


  changePageState () {
    switch (this.currentState) {
      case 'room': this.currentState = this.pageStates[this.stateCount]; break;
      case 'bedroom': this.currentState = this.pageStates[this.stateCount]; break;
      case 'bathroom': this.currentState = this.pageStates[this.stateCount]; break;
      case 'location': this.currentState = this.pageStates[this.stateCount]; break;
      case 'amentities': this.currentState = this.pageStates[this.stateCount]; break;
      case 'spaces': this.currentState = this.pageStates[this.stateCount]; break;
      default: this.currentState = this.pageStates[this.stateCount]; break;
    }
  }

  backPageState () {
    if (this.stateCount > 0) {
      this.stateCount--;
      this.changePageState();
    }
  }

  nextPageState () {
    if (this.stateCount < 5) {
      this.stateCount++;
      this.changePageState();
    }
  }


  increaseBedroomCount () {
    this.bedroomCount++;
  }

  decreaseBedroomCount () {
    if (this.bedroomCount > 0 ) {
      this.bedroomCount--;
    }
  }

  increaseBathroomCount() {
    this.bathroomCount++;
  }

  decreaseBathroomCount() {
    if (this.bathroomCount > 0) {
      this.bathroomCount--;
    }
  }

  ngOnInit() {
  }

}
