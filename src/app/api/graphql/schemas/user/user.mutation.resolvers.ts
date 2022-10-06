import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { IUser } from "../../../../modules/user/user.model";
import { EUserRole } from "../../../../modules/user/user.entity";
import {
  TUserUpdateArgs,
  TUserUpdateBalanceArgs,
  TUserUpdateSetBlockedArgs,
} from "./user.input";

/**
 * Resolver for `userUpdate` mutation
 **/

const userUpdate: ISchemaLevelResolver<
  any,
  TContext,
  TUserUpdateArgs,
  Promise<IUser>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id, input } = args;

  const user = await services.userService.updateById(id, input);

  return user;
};

/**
 * Resolver for `userUpdateBalance` mutation
 **/

const userUpdateBalance: ISchemaLevelResolver<
  any,
  TContext,
  TUserUpdateBalanceArgs,
  Promise<IUser>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id, amount } = args;

  const user = await services.userService.updateBalance(id, amount);

  return user;
};

/**
 * Resolver for `userUpdateSetBlocked` mutation
 **/

const userUpdateSetBlocked: ISchemaLevelResolver<
  any,
  TContext,
  TUserUpdateSetBlockedArgs,
  Promise<IUser>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id, isBlocked } = args;

  const user = await services.userService.setBlocked(id, isBlocked, {
    executorRole: ctx.user?.role || EUserRole.USER,
  });

  return user;
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    userUpdate,
    userUpdateBalance,
    userUpdateSetBlocked,
  },
};
