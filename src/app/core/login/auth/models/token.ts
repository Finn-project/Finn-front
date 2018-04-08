export interface Token {
  token: string;
  user: {
    id: number,
    username: any,
    email: any,
    first_name: string,
    last_name: string,
    phone_num: number,
    signup_type: string,
    img_profile: any
  };
}
