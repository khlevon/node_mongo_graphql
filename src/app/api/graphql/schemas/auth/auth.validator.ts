import {
  TAuthSignInArgs,
  TAuthSignUpArgs,
} from "./auth.input";
import * as yup from "yup";
import { EUserGender } from "../../../../modules/user/user.entity";

export const AuthSignInArgsSchema: yup.SchemaOf<TAuthSignInArgs> = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(12).required(),
  });

export const AuthSignUpArgsSchema: yup.SchemaOf<TAuthSignUpArgs> = yup
  .object()
  .shape({
    input: yup
      .object()
      .shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        middleName: yup.string(),
        gender: yup
          .mixed<EUserGender>()
          .oneOf(Object.values(EUserGender))
          .required(),
        birthDate: yup.date(),
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().min(6).max(12).required(),
      })
      .required(),
  });
