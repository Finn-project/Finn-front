export interface Token {
  token: string;
  user: {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    phone_num: number,
    signup_type: string,
    img_profile: any
  };
}
