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
  Authorization: string;
  house_value: any;
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

  img_check(pk: number): Observable<any> {
    return this.http.get<any>(`${this.url}house/${pk}`)
      .do(res => this.house_value = res)
    .shareReplay();
  }
  gethouse_value() {
    return this.house_value;
  }

// 유저 정보 수정
  // 유저 프로필 이미지 수정
  patchUserImage(formData : FormData): Observable<User> {
    const endpoint = `${this.url}user/${this.getUser().pk}/`;
    const headerConfig = {
      Authorization: `token ${this.getToken()}`
    };
    formData.append('email', this.getUser().username);
    return this.http
      .patch<User>(endpoint, formData, { headers: headerConfig })
      .do(res => {
        console.log('patchUserImage', res);
        this.setUser(res)});
  }
  // 유저 프로필 정보 수정
  patchUser(data): Observable<User> {
    const endpoint = `${this.url}user/${this.getUser().pk}/`;
    const headerConfig = {
      Authorization: `token ${this.getToken()}`
    };
    data = Object.assign({}, data, { email: this.getUser().username });
    console.log('patch User data', data)
    return this.http
      .patch<User>(endpoint, data, { headers: headerConfig })
      .do(res => {this.setUser(res); });
  }
  // 유저 프로필 이미지 삭제
  deleteProfileImage() {
    const endpoint = `${this.url}user/${this.getUser().pk}/noimage`;
    const headerConfig = {
      Authorization: `token ${this.getToken()}`
    };
    return this.http
      .delete(endpoint, {headers: headerConfig})
      .do(() => {
        let user = this.getUser();
        user = Object.assign({}, user, {images: null});
        console.log('delete User Image Success', user);
        this.setUser(user);
      });
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
  getUser(): User {
    const user = JSON.parse(localStorage.getItem(this.user));
    return user;
  }
  setUser(user) {
    console.log('setUser', user);
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
