import { EUserGender } from "../../../../modules/user/user.entity";

export type TAuthSignInArgs = {
  email: string;
  password: string;
};

export type TAuthSignUpArgs = {
  input: {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: EUserGender;
    birthDate?: Date;
    email: string;
    username: string;
    password: string;
  };
};
