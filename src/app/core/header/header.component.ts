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
  modal: boolean = false;
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

  toggleLoginModal() {
    this.modal = !this.modal;
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
