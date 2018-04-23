import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/login/auth';
import { User } from '../../../core/login/auth/models/user';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  userForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService) { 
  }

  get user(): User {
    return this.auth.getUser();
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      essentialControls: this.fb.group({
        firstname: ['', [
          Validators.required
        ]]
      })
    });
  }

  onSubmit() {
    console.log('userForm', this.userForm);
    console.log('submit');
  }
}
