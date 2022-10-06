import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { getConnectionMetadata } from "../../../../common/utils";
import { TContext } from "../../../../../types/graphql";
import { TConnection } from "../../../../../types/graphql";
import { EUserRole, TUser } from "../../../../modules/user/user.entity";
import { differenceInYears } from "date-fns";
import { isNull, omitBy } from "lodash";
import {
  TUserGetAllArgs,
  TUserGetAllFilter,
  TUserGetOneArgs,
  TUserGetOneByUsernameArgs,
  TUserGrossRevenueArgs,
} from "./user.input";
import {
  TProductGetAllArgs,
  TProductGetAllFilter,
} from "../product/product.inputs";
import {
  TTransactionGetAllArgs,
  TTransactionGetAllFilter,
} from "../transaction/transaction.input";
import { IUser } from "../../../../modules/user/user.model";
import { IProduct } from "../../../../modules/product/product.model";
import { ITransaction } from "../../../../modules/transaction/transaction.model";
import { AppError } from "../../../../common/errors/app.error";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";

/**
 * Resolver for `userGetAll` query
 **/

const userGetAll: ISchemaLevelResolver<
  any,
  TContext,
  TUserGetAllArgs,
  Promise<TConnection<TUser>>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TUserGetAllFilter>(args);

  const { count, payload } = await services.userService.getAll(
    { offset, limit },
    { field, direction },
    filter
  );

  return {
    count,
    pageInfo: {
      offset,
      limit,
      hasNextPage: offset + limit < count,
    },
    edges: payload.map((user) => ({
      cursor: user.id,
      node: user,
    })),
  };
};

/**
 * Resolver for `userGetOne` query
 **/

const userGetOne: ISchemaLevelResolver<
  any,
  TContext,
  TUserGetOneArgs,
  Promise<IUser>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const user = await services.userService.getOneById(id);

  return user;
};

/**
 * Resolver for `userGetOneByUsername` query
 **/

const userGetOneByUsername: ISchemaLevelResolver<
  any,
  TContext,
  TUserGetOneByUsernameArgs,
  Promise<IUser>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { username } = args;

  const user = await services.userService.getOneByUsername(username);

  return user;
};

/**
 * Resolver for `User.age` type
 */

const userAge: ISchemaLevelResolver<
  IUser,
  TContext,
  any,
  Promise<number | null>
> = async (user, _args, _ctx, _info) => {
  const { birthDate } = user;
  const currentDate = new Date();

  let age: number | null = null;

  if (birthDate) {
    age = differenceInYears(currentDate, birthDate);
  }

  return age;
};

/**
 * Resolver for `User.grossRevenue` type
 */

const userGrossRevenue: ISchemaLevelResolver<
  IUser,
  TContext,
  TUserGrossRevenueArgs,
  Promise<number>
> = async (user, args, ctx, _info) => {
  const { services } = ctx;
  const { startDate, endDate } = omitBy(args, isNull);

  const grossRevenue = await services.userService.getGrossRevenueByUserId(
    user.id.toString(),
    startDate,
    endDate
  );

  return grossRevenue;
};

/**
 * Resolver for `User.products` type
 */

const userProducts: ISchemaLevelResolver<
  IUser,
  TContext,
  TProductGetAllArgs,
  Promise<TConnection<IProduct>>
> = async (user, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TProductGetAllFilter>(args);

  const authUserRole = ctx.user?.role || EUserRole.USER;

  const { count, payload } = await services.productServices.getAll(
    { offset, limit },
    { field, direction },
    {
      ...filter,
      ...(authUserRole !== EUserRole.USER ? {} : { isBlocked: false }),
      ownerId: user.id.toString(),
    }
  );

  return {
    count,
    pageInfo: {
      offset,
      limit,
      hasNextPage: offset + limit < count,
    },
    edges: payload.map((product) => ({
      cursor: product.id,
      node: product,
    })),
  };
};

/**
 * Resolver for `User.transactions` type
 */

const userTransactions: ISchemaLevelResolver<
  IUser,
  TContext,
  TTransactionGetAllArgs,
  Promise<TConnection<ITransaction>>
> = async (user, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TTransactionGetAllFilter>(args);

  const { count, payload } = await services.transactionService.getAll(
    { offset, limit },
    { field, direction },
    { ...filter, ownerId: user.id.toString() }
  );

  return {
    count,
    pageInfo: {
      offset,
      limit,
      hasNextPage: offset + limit < count,
    },
    edges: payload.map((transaction) => ({
      cursor: transaction.id,
      node: transaction,
    })),
  };
};

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    userGetAll,
    userGetOne,
    userGetOneByUsername,
  },
  User: {
    age: userAge,
    grossRevenue: userGrossRevenue,
    products: userProducts,
    transactions: userTransactions,
  },
};
