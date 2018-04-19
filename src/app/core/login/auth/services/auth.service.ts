import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';

import { Token } from '../models/token';
import { User } from '../models/user';

import { JwtHelper } from 'angular2-jwt';
import { SocialAuthService } from './social-auth.service';

import { environment } from '../../../../../environments/environment';
@Injectable()
export class AuthService {
  router: any;
  url = `${environment.apiUrl}`;
  TOKEN_NAME = environment.tokenName;
  user = environment.user;
  pk: number;
  disableDay: any;
  price: number;
  minimum_check_in_duation: number;
  maximum_check_in_range: number;
  Authorization: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelper,
    private socialAuth: SocialAuthService
  ) {}
// 회원가입 후 자동 로그인 되게 함
  sign(signForm): Observable<Token> {
    return this.http.post<Token>(`${this.url}user/`, signForm )
      .do(res => console.log(res , res.user))
      .do(res => this.setToken(res.token))
      .do(res => this.setUser(res.user))
      .shareReplay();
  }
// 로그인 기능
  login(username , password): Observable<Token> {
    return this.http.post<Token>(`${this.url}user/login/`, { username: username, password: password} )
    .do(res => console.log(res.user.images))
    .do(res => this.setToken(res.token))
    .do(res => this.setUser(res.user))

    .shareReplay();
  }
// 쇼셜 로그인
  socialSignin(facebook: string): Observable<Token> {
    return this.socialAuth.getSocialCredential(facebook)
      .switchMap(credential => {
        console.log('credential', credential);
        return this.http.post<Token>(`${this.url}user/facebook-login/`, credential);
      })
      .do(res => console.log(123213))
      .do(res => this.setToken(res.token))
      .do(res => console.log(res.token))
      .do(res => this.setUser(res.user))
      .shareReplay();
  }

  img_check(pk: number): Observable<object> {
    return this.http.get(`${this.url}house/${pk}` )
      .do(res =>  this.price = res.price_per_night)
      .do(res =>  this.pk = res.pk )
      .do(res => this.disableDay = res.disable_days)
      .do(res => this.minimum_check_in_duation = res.minimum_check_in_duration)
      .do(res => this.maximum_check_in_range = res.maximum_check_in_range)
    .shareReplay();
  }

  disable() {
    return this.disableDay;
  }
  getprice() {
    return this.price;
  }
  getMinimum_check_in_duation() {
    console.log(this.minimum_check_in_duation);
    return this.minimum_check_in_duation;
  }
  getMaximum_check_in_range() {
    return this.maximum_check_in_range;
  }

// 인증 관련 함수들
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }
  getToken(): string {
    return localStorage.getItem(this.TOKEN_NAME);
  }
  setToken(token: string): void {
      localStorage.setItem(this.TOKEN_NAME, token);
      this.Authorization = token;
      console.log(token);
    }
/* user 값 받아 올떄 사용하기 */
  getUser(): string {
    const user = JSON.parse(localStorage.getItem(this.user));
    return user;
  }
  setUser(user) {
    localStorage.setItem(this.user, JSON.stringify(user));
  }

// 삭제
  signout(): void {
    this.removeToken();
    this.http.post(`${this.url}user/logout/`, this.Authorization)
      .subscribe(() => this.router.navigate(['']));
  }
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem(this.user);
  }
// jwt 사용 해서 확인하는곧
  isTokenExpired(token: string) {
    return this.jwtHelper.isTokenExpired(token);
  }
  getDecodeToken() {
    return this.jwtHelper.decodeToken(this.getToken());
  }
}
