export interface Token {
  token: string;
  user: {
    id: number,
    username: any,
    email: any,
    first_name: string,
    last_name: string,
    phone_num: number,
    img_profile: any,
    is_host: boolean,
    is_email_user: boolean,
    is_facebook_user: boolean
  };
}
