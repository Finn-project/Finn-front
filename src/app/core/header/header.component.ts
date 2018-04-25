import { Component, OnInit, Output, EventEmitter, HostListener,
Renderer2, ViewChild, ElementRef, NgZone, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService, AuthGuard } from '../login/auth';
import { Token } from '@angular/compiler';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { FullModalService } from '../service/full-modal.service';
import { User } from '../login/auth/models/user';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpParams } from '@angular/common/http';
import { SearchHouseService } from '../service/search-house.service';

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
  searchModalInput: string = '';
  navToDropdown: boolean = window.innerWidth < 1228 ? true : false;
  showDropdown: boolean = false;
  showSearchModal: boolean = false;
  isInputFocused: boolean = false;
  isModalInputFocused: boolean = false;
  profilePath: string = '';

  @ViewChildren('headerSearch, headerSearch2') searchElementList: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public auth: AuthService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fullModal: FullModalService,
    public guard: AuthGuard,
    private searchHouse: SearchHouseService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1128) {
      this.navToDropdown = true;
    } else {
      this.navToDropdown = false;
    }
  }

  get user() {
    return this.auth.getUser();
  }

  ngOnInit() {
    this.profilePath = this.user ? this.user.images.img_profile_28 : '';
  }

  ngAfterViewInit() {
    this.searchElementList.forEach(child => {
      this.mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(child.nativeElement);
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            // get the place result
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            console.log('place', place);
            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            var map = new google.maps.Map(document.getElementById('testmap'), {
              zoom: 15,
              center: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
            });
            map.addListener('bounds_changed', () => {
              console.log(map.getBounds());
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  "latitude": place.geometry.location.lat(),
                  "longitude": place.geometry.location.lng(),
                  "neLat": map.getBounds().getNorthEast().lat(),
                  "neLng": map.getBounds().getNorthEast().lng(),
                  "swLat": map.getBounds().getSouthWest().lat(),
                  "swLng": map.getBounds().getSouthWest().lng(),
                }
              };
              this.router.navigate(["search_page"], navigationExtras);
            });


            // this.searchHouse.setlatitude = place.geometry.location.lat();
            // this.searchHouse.setlongitude = place.geometry.location.lng();
            // console.log('searchHouse lat',this.searchHouse.getlatitude);
            // console.log('searchHouse lng',this.searchHouse.getlongitude);
            // this.router.navigate(['search_page'])
            // set latitude, longitude and zoom
            // this.latitude = place.geometry.location.lat();
            // this.longitude = place.geometry.location.lng();
            // this.zoom = 12;
          });
        });
      });
    });
  }

  onLogoClick() {
    if (this.navToDropdown) {
      this.toggleDropdown();
    } else {
      this.router.navigate(['']);
    }
  }

  toggleLoginModal() {
    if (this.showDropdown) {this.toggleDropdown(); }
    this.modal = !this.modal;
    if (this.login_signUp = false) {
      this.login_sign = false;
    } else {
      this.login_sign = true;
    }
  }

  toggleSearchModal() {
    this.showSearchModal = !this.showSearchModal;
    this.fullModal.toggleFullModal();
  }

  toggleSignUpModal() {
    if (this.showDropdown) { this.toggleDropdown(); }
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
  }

  moveSignIn() {
    this.login_sign = false;
    this.login_signUp = true;
  }

  move() {
    if (this.login_signUp = false) {
      this.login_sign = true;
    } else {
      this.login_signUp = true;
    }
  }

  offButton() {
    this.modal = false;
  }

  toggleDropdown() {
    this.fullModal.toggleFullModal();
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

  onFocusSearchModalInput() {
    this.isModalInputFocused = true;
  }

  onBlurSearchModalInput() {
    this.isModalInputFocused = false;
  }

  hasRole() {
    return this.auth.getUser();
  }

  getProfileImage() {
    const defaultImgDir = 'assets/img/defaultProfileImg.png';
    const images = this.user ? this.user.images : null;
    return images && images.img_profile_28 ? images.img_profile_28 : defaultImgDir;
  }

  logout() {
    this.auth.signout();
    this.router.navigate(['']);
    this.toggleDropdown();
  }
}
