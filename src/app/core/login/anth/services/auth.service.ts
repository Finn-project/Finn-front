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
  url = `${environment.apiUrl}`;
  TOKEN_NAME = environment.tokenName;
  user = environment.user;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelper,
    private socialAuth: SocialAuthService
  ) {}

  login(username , password): Observable<Token> {
    return this.http.post<any>(`${this.url}user/login/`, { username: username, password: password} )
    .do(res => console.log(res.token, res.user.id))
    .do(res => this.setToken(res.token))
    .do(res => this.setUser(res.user))

    .shareReplay();
  }
  socialSignin(provider: string): Observable<Token> {
    return this.socialAuth.getSocialCredential(provider)
      .switchMap(credential => this.http.post<Token>(`${this.url}facebook-login/`, credential))
      .do(res => this.setToken(res.token))
      .do(res => this.setUser(res.user))
      .shareReplay();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }
  getToken(): string {
    return localStorage.getItem(this.TOKEN_NAME);
  }
  getUser(): string {
    return localStorage.getItem(this.user);
  }

  setToken(token: string): void {
      localStorage.setItem(this.TOKEN_NAME, token);
    }
  setUser(user) {
    localStorage.setItem(this.user, user);
  }

// 삭제
  signout(): void {
    this.removeToken();
  }
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_NAME);
  }
// jwt 사용 해서 확인하는곧
  isTokenExpired(token: string) {
    return this.jwtHelper.isTokenExpired(token);
  }

  getDecodeToken() {
    return this.jwtHelper.decodeToken(this.getToken());
  }
}
