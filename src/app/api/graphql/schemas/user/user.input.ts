import { TOrderBy, TPagination } from "../../../../../types/app";
import { EUserGender } from "../../../../modules/user/user.entity";

export type TUserGetAllFilter = {
  username?: string;
  gender?: EUserGender;
};

export type TUserGetAllArgs = {
  pagination?: TPagination;
  orderBy?: TOrderBy;
  filter?: TUserGetAllFilter;
};

export type TUserGetOneArgs = {
  id: string;
};

export type TUserGetOneByUsernameArgs = {
  username: string;
};

export type TUserUpdateInput = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: EUserGender;
  birthDate?: Date;
};

export type TUserUpdateArgs = {
  id: string;
  input: TUserUpdateInput;
};

export type TUserUpdateBalanceArgs = {
  id: string;
  amount: number;
};

export type TUserUpdateSetBlockedArgs = {
  id: string;
  isBlocked: boolean;
};

export type TUserGrossRevenueArgs = {
  startDate: Date;
  endDate: Date;
};
