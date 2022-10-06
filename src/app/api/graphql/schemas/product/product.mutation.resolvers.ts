import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { ApolloError } from "apollo-server-express";
import { TContext } from "../../../../../types/graphql";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";
import { AppError } from "../../../../common/errors/app.error";
import { IProduct } from "../../../../modules/product/product.model";
import {
  TProductCreateArgs,
  TProductUpdateArgs,
  TProductUpdateSetBlockedArgs,
} from "./product.inputs";

/**
 * Resolver for `productCreate` mutation
 **/

const productCreate: ISchemaLevelResolver<
  any,
  TContext,
  TProductCreateArgs,
  Promise<IProduct>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { input } = args;

  const ownerId = ctx.user?.id;

  if (!ownerId) {
    throw new AppError("Unauthorized", {
      status: HTTPStatuses.UNAUTHORIZED,
    });
  }

  const product = await services.productServices.createOne({
    ...input,
    isBlocked: false,
    ownerId,
  });

  return product;
};

/**
 * Resolver for `productUpdate` mutation
 **/

const productUpdate: ISchemaLevelResolver<
  any,
  TContext,
  TProductUpdateArgs,
  Promise<IProduct>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id, input } = args;

  const product = await services.productServices.updateById(id, input);

  return product;
};

/**
 * Resolver for `productUpdateSetBlocked` mutation
 **/

const productUpdateSetBlocked: ISchemaLevelResolver<
  any,
  TContext,
  TProductUpdateSetBlockedArgs,
  Promise<IProduct>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id, isBlocked } = args;

  const product = await services.productServices.setBlocked(id, isBlocked);

  return product;
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    productCreate,
    productUpdate,
    productUpdateSetBlocked,
  },
};
