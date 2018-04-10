import { Component, OnInit, Output, EventEmitter, HostListener, Renderer2, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth';
import { Token } from '@angular/compiler';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  modal: boolean = false;
  login_sign: boolean;
  login_signUp: boolean;
  searchInput: string = '';
  navToDropdown: boolean = window.innerWidth < 1228 ? true : false;
  showDropdown: boolean = false;
  isInputFocused: boolean = false;
  
  @ViewChild("headerSearch")
  public searchElementRef: ElementRef;
  
  constructor(
    private router: Router,
    private renderer: Renderer2,
    public auth: AuthService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1128) {
      this.navToDropdown = true;
    } else {
      this.navToDropdown = false;
    }
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      console.log('maps loaded');
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      console.log('autocomplete', autocomplete);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log('place', place);
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          
          //set latitude, longitude and zoom
          // this.latitude = place.geometry.location.lat();
          // this.longitude = place.geometry.location.lng();
          // this.zoom = 12;
        });
      });
    });
  }

  ngAfterViewInit() {
    console.log('[ngAfterViewInit]', this.searchElementRef);
  }

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

  // technique이 부족한 저의 코드..
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
