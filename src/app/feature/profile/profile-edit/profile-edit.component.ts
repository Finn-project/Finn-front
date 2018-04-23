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
        first_name: [this.user && this.user.first_name, [
          Validators.required
        ]],
        last_name: [this.user && this.user.last_name, [
          Validators.required
        ]],
        phone_num: [this.user && this.user.phone_num, [
          Validators.required,
          Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/),
        ]],
      })
    });
  }

  onSubmit() {
    console.log('firstname', this.userForm.value);
    console.log('essentialControls', this.essentialControls.value);
    let data = Object.assign({}, this.essentialControls.value)
    this.auth.patchUser(data).subscribe((result) => {
      console.log('result', result)
    })
  }

  get essentialControls() {
    return this.userForm.get('essentialControls');
  }

  get firstname() {
    return this.userForm.get('essentialControls.first_name');
  }

  get lastname() {
    return this.userForm.get('essentialControls.last_name');
  }

  get phone_num() {
    return this.userForm.get('essentialControls.phone_num');
  }
}
