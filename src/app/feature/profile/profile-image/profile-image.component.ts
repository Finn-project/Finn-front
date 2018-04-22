import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/login/auth';
import { User } from '../../../core/login/auth/models/user';

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

  get user(): User {
    return this.auth.getUser();
  }
  
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

  onDeleteProfile() {
    this.auth.deleteProfileImage().subscribe((result) => {
      console.log('delete image result', result);
    });
  }

  getProfileImage() {
    const defaultImgDir = 'assets/img/defaultProfileImg.png';
    const images = this.user ? this.user.images : null;
    return images ? images.img_profile_225 : defaultImgDir;
  }
}
