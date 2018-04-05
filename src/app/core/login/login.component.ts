import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() modal;
  @Output() toggleLoginModal = new EventEmitter();
  sigin: boolean;
  url = 'https://himanmen.com/';

  userForm: FormGroup;

  signForm: FormGroup;
  constructor(public http: HttpClient, private router: Router) { }

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
// 회원가입 done
  sign() {
    console.log(this.signForm.value);
    this.http.post(`${this.url}user/`, this.signForm.value)
      .subscribe(() => {
        this.modal = false;
        this.signForm.reset();
        this.sigin = false;
      });
  }
  // login ing~~
  login() {
    console.log(this.userForm);
  }

  match () {
    if (this.signForm.value.password !== this.signForm.value.confirm_password) {
      return true;
    }
  }

}
