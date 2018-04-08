import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../login/auth';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  modal: boolean;
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  toggleLoginModal() {
    this.modal = !this.modal;
  }

}
