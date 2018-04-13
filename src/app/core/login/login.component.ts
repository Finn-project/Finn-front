import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AuthService } from './auth/services/auth.service';
import { AuthGuard } from './auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  url = `${environment.apiUrl}`;
  @Input()  modal;
  @Input() login_sign;
  @Input() login_signUp;
  @Output() offButton = new EventEmitter();
  @Output() moveSignIn = new EventEmitter();
  @Output() moveSignUp = new EventEmitter();

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
      username: new FormControl('', [
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
  // 회원가입 form

  get username() {
    return this.signForm.get('username');
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
    console.log(this.signForm.value);
    this.auth.sign(this.signForm.value)
      .subscribe( () => {
        this.signForm.reset();
        this.modal = !this.modal;
        this.router.navigate(['']);
      }, res => {this.status = res.status; } );
  }
// login
  login() {
    console.log(this.email_test.value);
    this.auth.login(this.email_test.value, this.password_test.value)
      .subscribe(
      () => {
        this.signForm.reset();
        this.modal = !this.modal; },
      () => this.router.navigate(['']),
      );
  }
// 소셜 로그인
  socialSignin(facebook) {
    this.auth.socialSignin(facebook)
      .subscribe(
      () => {
        this.signForm.reset();
        this.modal = !this.modal;
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
