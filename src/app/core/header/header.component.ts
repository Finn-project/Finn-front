import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  modal: boolean = false;
  showDropdown = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1128) {
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
    console.log(this.showDropdown);
  }
  
  constructor() { }

  ngOnInit() {}

  toggleLoginModal() {
    this.modal = !this.modal;
  }
}
