import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) { 
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      essentialControls: this.fb.group({
        firstname: ['', [
          Validators.required
        ]]
      })
    });

    console.log(this.userForm);
  }

}
