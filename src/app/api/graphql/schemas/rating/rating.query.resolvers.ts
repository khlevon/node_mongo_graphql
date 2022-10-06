import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { getConnectionMetadata } from "../../../../common/utils";
import { TContext } from "../../../../../types/graphql";
import { TConnection } from "../../../../../types/graphql";
import {
  TRatingGetAllArgs,
  TRatingGetAllFilter,
  TRatingGetOneArgs,
} from "./rating.input";
import { IRating } from "../../../../modules/rating/rating.model";
import { IUser } from "../../../../modules/user/user.model";
import { IProduct } from "../../../../modules/product/product.model";

/**
 * Resolver for `ratingGetAll` query
 **/

const ratingGetAll: ISchemaLevelResolver<
  any,
  TContext,
  TRatingGetAllArgs,
  Promise<TConnection<IRating>>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TRatingGetAllFilter>(args);

  const { count, payload } = await services.ratingServices.getAll(
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
    edges: payload.map((rating) => ({
      cursor: rating.id,
      node: rating,
    })),
  };
};

/**
 * Resolver for `ratingGetOne` query
 **/

const ratingGetOne: ISchemaLevelResolver<
  any,
  TContext,
  TRatingGetOneArgs,
  Promise<IRating>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const rating = await services.ratingServices.getOneById(id);

  return rating;
};

/**
 * Resolver for `Rating.owner` type
 */

const ratingOwner: ISchemaLevelResolver<
  IRating,
  TContext,
  any,
  Promise<IUser>
> = async (rating, _args, ctx, _info) => {
  const { services } = ctx;
  const { ownerId } = rating;

  const user = await services.userService.getOneById(ownerId.toString());

  return user;
};

/**
 * Resolver for `Rating.product` type
 */

const ratingProduct: ISchemaLevelResolver<
  IRating,
  TContext,
  any,
  Promise<IProduct>
> = async (rating, _args, ctx, _info) => {
  const { services } = ctx;
  const { productId } = rating;

  const product = await services.productServices.getOneById(
    productId.toString()
  );

  return product;
};

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    ratingGetAll,
    ratingGetOne,
  },
  Rating: {
    owner: ratingOwner,
    product: ratingProduct,
  },
};
