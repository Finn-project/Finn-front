import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/login/auth';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {
  profileForm: FormGroup;
  fileToUpload: File = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    let formData: FormData = new FormData();
    formData.append('img_profile', this.fileToUpload);
    this.auth.patchUser(formData).subscribe((result) => {
      console.log('result', result)
    }, (error) => {
      console.log('patch user error', error);
    });
  }

}
