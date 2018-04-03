import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() modal;
  @Output() loginModal = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }


}
