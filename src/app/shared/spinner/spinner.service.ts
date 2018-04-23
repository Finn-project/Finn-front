import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {

  public isShow = false;

  show() {
    this.isShow = true;
  }

  hide() {
    this.isShow = false;
  }

}
