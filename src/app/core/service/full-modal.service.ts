import { Injectable } from '@angular/core';

@Injectable()
export class FullModalService {
  private isOpen: boolean = false;

  constructor() {}

  get getIsOpen() {
    return this.isOpen;
  }

  toggleFullModal() {
    this.isOpen = !this.isOpen;
  }
}
