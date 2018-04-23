export interface User {
  username: string;
  password: string;
  pk: number;
  first_name: string;
  last_name: string;
  phone_num: string;
  images: {
    img_profile?: string;
    img_profile_28?: string;
    img_profile_225?: string
  }
}
