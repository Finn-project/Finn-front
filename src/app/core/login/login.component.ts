import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() modal;
  @Output() toggleLoginModal = new EventEmitter();
  sigin: boolean;
  url = `${environment.apiUrl}`;

  userForm: FormGroup;
  message: string;
  status: number;
  signForm: FormGroup;
  constructor(
    public http: HttpClient,
    public router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() {

    this.userForm = new FormGroup({
      email_test: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)
      ]),
      password_test: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]/),
        Validators.minLength(4),
        Validators.maxLength(10)
      ])
    });

    this.signForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)
      ]),
      first_name: new FormControl('', [
        Validators.required
      ]),
      last_name: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      phone_num: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/),
      ]),
    });
  }
  viewStatus() {
    this.sigin = !this.sigin;
    console.log(this.signForm.value.email);

  }



  // 회원가입 form

  get email() {
    return this.signForm.get('email');
  }
  get first_name() {
    return this.signForm.get('first_name');
  }
  get last_name() {
    return this.signForm.get('last_name');

  }
  get password() {
    return this.signForm.get('password');

  }
  get confirm_password() {
    return this.signForm.get('confirm_password');

  }
  get phone_num() {
    return this.signForm.get('phone_num');

  }
  // login form
  get email_test() {
    return this.userForm.get('email_test');
  }
  get password_test() {
    return this.userForm.get('password_test');
  }
// 회원가입
  sign() {
    this.auth.sign(this.signForm.value)
      .subscribe( () => {
        this.modal = false;
        this.signForm.reset();
        this.sigin = false;
        this.router.navigate(['']);
      }, res => this.status = res.status );
  }
// login
  login() {
    console.log(this.email_test.value);
    this.auth.login(this.email_test.value, this.password_test.value)
      .subscribe(
      () => {
        this.modal = false;
        this.signForm.reset(); },
      () => this.router.navigate(['']),
      );
  }
// 소셜 로그인
  socialSignin(facebook) {
    this.auth.socialSignin(facebook)
      .subscribe(
      () => {
        this.modal = false;
        this.signForm.reset();
        console.log(123124);
        this.router.navigate(['']);
      },
      );
  }

  match () {
    if (this.signForm.value.password !== this.signForm.value.confirm_password) {
      return true;
    }
  }

}
