import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { getConnectionMetadata } from "../../../../common/utils";
import { TContext } from "../../../../../types/graphql";
import { TConnection } from "../../../../../types/graphql";
import { TTransactionProduct } from "../../../../modules/transaction/transaction.entity";
import {
  TTransactionGetAllArgs,
  TTransactionGetAllFilter,
  TTransactionGetOneArgs,
} from "./transaction.input";
import { ITransaction } from "../../../../modules/transaction/transaction.model";
import { IUser } from "../../../../modules/user/user.model";
import { IProduct } from "../../../../modules/product/product.model";
import { WithId } from "../../../../../types/utils";

/**
 * Resolver for `transactionGetAll` query
 **/

const transactionGetAll: ISchemaLevelResolver<
  any,
  TContext,
  TTransactionGetAllArgs,
  Promise<TConnection<ITransaction>>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TTransactionGetAllFilter>(args);

  const { count, payload } = await services.transactionService.getAll(
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
    edges: payload.map((transaction) => ({
      cursor: transaction.id,
      node: transaction,
    })),
  };
};

/**
 * Resolver for `transactionGetOne` query
 **/

const transactionGetOne: ISchemaLevelResolver<
  any,
  TContext,
  TTransactionGetOneArgs,
  Promise<ITransaction>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const transaction = await services.transactionService.getOneById(id);

  return transaction;
};

/**
 * Resolver for `Transaction.owner` type
 */

const transactionOwner: ISchemaLevelResolver<
  ITransaction,
  TContext,
  any,
  Promise<IUser>
> = async (transaction, _args, ctx, _info) => {
  const { services } = ctx;
  const { ownerId } = transaction;
  const user = await services.userService.getOneById(ownerId.toString());

  return user;
};

/**
 * Resolver for `Transaction.products[].product` type
 */

const transactionProduct: ISchemaLevelResolver<
  WithId<TTransactionProduct>,
  TContext,
  any,
  Promise<IProduct>
> = async (transaction, _args, ctx, _info) => {
  const { services } = ctx;
  const { productId } = transaction;
  const product = await services.productServices.getOneById(
    productId.toString()
  );

  return product;
};

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    transactionGetAll,
    transactionGetOne,
  },
  Transaction: {
    owner: transactionOwner,
  },
  TransactionProduct: {
    product: transactionProduct,
  },
};
