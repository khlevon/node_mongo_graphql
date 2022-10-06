import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { TAuthSignInArgs, TAuthSignUpArgs } from "./auth.input";

type TAuth = {
  token: string;
};

/**
 * Resolver for `authSignIn` mutation
 **/
const authSignIn: ISchemaLevelResolver<
  any,
  TContext,
  TAuthSignInArgs,
  Promise<TAuth>
> = async (_parent, args, ctx, _info) => {
  const { email, password } = args;
  const { services } = ctx;

  const token = await services.authService.signIn(email, password);

  return { token };
};

/**
 * Resolver for `authSignUp` mutation
 **/
const authSignUp: ISchemaLevelResolver<
  any,
  TContext,
  TAuthSignUpArgs,
  Promise<TAuth>
> = async (_parent, args, ctx, _info) => {
  const {
    input: {
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
      username,
      email,
      password,
    },
  } = args;
  const { services } = ctx;

  const token = await services.authService.signUp({
    firstName,
    lastName,
    middleName,
    gender,
    birthDate,
    username,
    email,
    password,
    userAgent: ctx.req.headers["user-agent"] || "",
  });

  return { token };
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    authSignIn,
    authSignUp,
  },
};
