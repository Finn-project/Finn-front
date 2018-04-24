import { Injectable } from '@angular/core';

@Injectable()
export class SearchHouseService {
  latitude: number;
  longitude: number;

  constructor() { }

  set setlatitude(latitude: number) {
    this.latitude = latitude;
  }

  set setlongitude(longitude: number) {
    this.longitude = longitude;
  }

  get getlatitude() {
    return this.latitude;
  }

  get getlongitude() {
    return this.longitude;
  }
}
