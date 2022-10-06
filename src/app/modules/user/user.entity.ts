export enum EUserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum EUserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export type TUser = {
  email: string;
  username: string;
  password: string;
  passwordSalt: string;
  role: EUserRole;
  isBlocked: boolean;

  firstName: string;
  lastName: string;
  middleName?: string;

  gender: EUserGender;
  birthDate?: Date;
  image?: string;
  balance: number;

  userAgent: string;
};
