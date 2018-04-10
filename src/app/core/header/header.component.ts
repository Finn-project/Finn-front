import { Component, OnInit, Output, EventEmitter, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  modal: boolean;
  user = this.auth.getUser();
  login_sign: boolean;
  login_signUp: boolean;
  searchInput: string = '';
  navToDropdown: boolean = window.innerWidth < 1228 ? true : false;
  showDropdown: boolean = false;
  isInputFocused: boolean = false;

  constructor(private router: Router, private renderer: Renderer2, public auth: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1128) {
      this.navToDropdown = true;
    } else {
      this.navToDropdown = false;
    }
  }
  ngOnInit() {}

  onLogoClick() {
    if (this.navToDropdown) {
      this.toggleDropdown();
    } else {
      this.router.navigate(['']);
    }
  }
/* toggle modal  */
  toggleLoginModal() {
   this.modal = !this.modal;
    if (this.login_signUp = false) {
      this.login_sign = false;
    }else {
      this.login_sign = true;
    }
  }
  toggleSinnUpModal() {
    this.modal = !this.modal;
    if (this.login_sign = false) {
      this.login_signUp = false;
    } else {
      this.login_signUp = true;
    }
  }
  moveSignUp() {
    this.login_signUp = false;
    this.login_sign = true;
    console.log('moveSignUp');
  }
  moveSignIn() {
    this.login_sign = false;
    this.login_signUp = true;
    console.log('moveSignIn');
  }

  move() {
    if (this.login_signUp = false){
      this.login_sign = true;
    }
    else{
      this.login_signUp = true;
    }
  }
  offButton() {
    this.modal = false;
  }


  toggleDropdown () {
    if (this.showDropdown) {
      document.getElementById("myNav").style.height = "0%";
      document.body.className = document.body.className.replace(/on-dropdown-show/i, '')
    } else {
      document.getElementById("myNav").style.height = "100%";
      document.body.className += 'on-dropdown-show';
    }
    this.showDropdown = !this.showDropdown;
  }

  clearSearchInput() {
    this.searchInput = '';
  }

  onFocusSearchInput() {
    this.isInputFocused = true;
  }

  onBlurSearchInput() {
    this.isInputFocused = false;
  }


}
