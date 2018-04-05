import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/switchMap';

import {
  SocialAuthConfig,
  FACEBOOK_AUTH_CONFIG,
} from './social-auth.config';

declare const FB: any;

interface Credential {
  uid: number;
  accessToken: string;
}

@Injectable()
export class SocialAuthService {

  constructor() {
    this.initProviderConfig(
      FACEBOOK_AUTH_CONFIG,
    );
  }
  getSocialCredential(provider: string): Observable<Credential> {
    return Observable.create((observer: Observer<Credential>) => {
      switch (provider) {
        case 'facebook':
          FB.getLoginStatus(response => {
            if (response.status === 'connected') {
              observer.next(this.fetchFacebookCredential(response.authResponse));
            } else {
              FB.login(response => {
                if (response.status === 'connected') {
                  observer.next(this.fetchFacebookCredential(response.authResponse));
                }
              });
            }
            observer.complete();
          });
          break;
      }});
  }

 private fetchFacebookCredential(authResponse): Credential {
  return {
        uid: authResponse.userID,
         accessToken: authResponse.accessToken
    };
  }
  private initProviderConfig(...configs: SocialAuthConfig[]) {
    configs.forEach(this.loadScript);
  }
  private loadScript(config: SocialAuthConfig) {
    if (document.getElementById(config.provider)) { return; }

    const script = document.createElement('script');
    script.id = config.provider;
    script.src = config.sdk;
    script.async = true;
    script.onload = () => { config.init(); };
    document.head.appendChild(script);
  }
}
