import { Injectable } from '@angular/core';

@Injectable()
export class FullModalService {
  private isOpen: boolean = false;

  constructor() { }

  get open() {
    console.log('get open')
    return this.isOpen;
  }

  toggleIsOpen() {
    console.log('toggleIsOpen');
    this.isOpen = !this.isOpen;
  }
}
