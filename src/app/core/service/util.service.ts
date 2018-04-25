import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
