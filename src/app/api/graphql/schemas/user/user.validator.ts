import {
  TUserGetAllArgs,
  TUserGetOneArgs,
  TUserGetOneByUsernameArgs,
  TUserGrossRevenueArgs,
  TUserUpdateArgs,
  TUserUpdateBalanceArgs,
  TUserUpdateSetBlockedArgs,
} from "./user.input";
import * as yup from "yup";
import { EUserGender } from "../../../../modules/user/user.entity";
import { SortOrder } from "mongoose";

export const UserGetAllArgsSchema: yup.SchemaOf<TUserGetAllArgs> = yup
  .object()
  .shape({
    pagination: yup.object().shape({
      offset: yup.number().min(0).default(0),
      limit: yup.number().min(1).default(100),
    }),
    orderBy: yup.object().shape({
      field: yup.string().oneOf(["createdAt"]).default("createdAt"),
      direction: yup.mixed<SortOrder>().oneOf(["asc", "desc"]).default("desc"),
    }),
    filter: yup.object().shape({
      username: yup.string(),
      gender: yup.mixed<EUserGender>().oneOf(Object.values(EUserGender)),
    }),
  });

export const UserGetOneArgsSchema: yup.SchemaOf<TUserGetOneArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });

export const UserGetOneByUsernameArgsSchema: yup.SchemaOf<TUserGetOneByUsernameArgs> = yup
  .object()
  .shape({
    username: yup.string().required(),
  });

export const UserUpdateArgsSchema: yup.SchemaOf<TUserUpdateArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
    input: yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      middleName: yup.string(),
      gender: yup.mixed<EUserGender>().oneOf(Object.values(EUserGender)),
      birthDate: yup.date(),
    }),
  });

export const UserUpdateBalanceArgsSchema: yup.SchemaOf<TUserUpdateBalanceArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
    amount: yup.number().positive().required(),
  });

export const UserUpdateSetBlockedArgsSchema: yup.SchemaOf<TUserUpdateSetBlockedArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
    isBlocked: yup.bool().required(),
  });

export const UserGrossRevenueArgsSchema: yup.SchemaOf<TUserGrossRevenueArgs> = yup
  .object()
  .shape({
    startDate: yup.date().required(),
    endDate: yup.date().required(),
  });
