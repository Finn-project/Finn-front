declare const FB: any;
declare const gapi: any;
declare const Kakao: any;

export interface SocialAuthConfig {
  provider: string;
  appId: string;
  sdk: string;
  init: Function;
}

import { environment } from '../../../../../environments/environment';

export const FACEBOOK_AUTH_CONFIG: SocialAuthConfig = {
  // https://developers.facebook.com/apps/153931948571383/dashboard/
  provider: 'facebook',
  appId: environment.facebookAppId,
  sdk: '//connect.facebook.net/en_US/sdk.js',
  init() {
    FB.init({
      appId: this.appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v2.8'
    });
    FB.AppEvents.logPageView();
  }
};
