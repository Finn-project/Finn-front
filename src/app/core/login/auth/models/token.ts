export interface Token {
  token: string;
  user: {
    pk: number,
    username: any,
    email: any,
    first_name: string,
    last_name: string,
    phone_num: number,
    is_host: boolean,
    img_profile: null,
    is_email_user: boolean,
    is_facebook_user: boolean,
    images: [
      {
      img_profile_28: any,
      img_profile_225: any,
      img_profile: any
      }
    ]
  };
}
