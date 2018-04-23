export interface User {
  username: string;
  password: string;
  pk: number;
  first_name: string;
  last_name: string;
  images: {
    img_profile: string;
    img_profile_150: string;
    img_profile_300: string
  }
}
