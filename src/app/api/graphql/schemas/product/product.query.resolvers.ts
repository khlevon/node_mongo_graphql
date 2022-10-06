import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { getConnectionMetadata } from "../../../../common/utils";
import { TConnection, TContext } from "../../../../../types/graphql";
import { IComment } from "../../../../modules/comment/comment.model";
import { IProduct } from "../../../../modules/product/product.model";
import { IRating } from "../../../../modules/rating/rating.model";
import { IUser } from "../../../../modules/user/user.model";
import { EUserRole } from "../../../../modules/user/user.entity";
import {
  TCommentGetAllArgs,
  TCommentGetAllFilter,
} from "../comment/comment.inputs";
import { TRatingGetAllArgs, TRatingGetAllFilter } from "../rating/rating.input";
import {
  TProductGetAllArgs,
  TProductGetAllFilter,
  TProductGetOneArgs,
} from "./product.inputs";

/**
 * Resolver for `productGetAll` query
 **/

const productGetAll: ISchemaLevelResolver<
  any,
  TContext,
  TProductGetAllArgs,
  Promise<TConnection<IProduct>>
> = async (_parent, args, ctx, _info) => {
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
 * Resolver for `productGetOne` query
 **/

const productGetOne: ISchemaLevelResolver<
  any,
  TContext,
  TProductGetOneArgs,
  Promise<IProduct>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const product = await services.productServices.getOneById(id);

  return product;
};

/**
 * Resolver for `productGetAllCategories` query
 **/

const productGetAllCategories: ISchemaLevelResolver<
  any,
  TContext,
  any,
  Promise<string[]>
> = async (_parent, _args, ctx, _info) => {
  const { services } = ctx;

  const categories = await services.productServices.getAllCategories();

  return categories;
};

/**
 * Resolver for `Product.owner` type
 */

const productOwner: ISchemaLevelResolver<
  IProduct,
  TContext,
  any,
  Promise<IUser>
> = async (product, _args, ctx, _info) => {
  const { services } = ctx;
  const { ownerId } = product;
  const user = await services.userService.getOneById(ownerId.toString());

  return user;
};

/**
 * Resolver for `Product.comments` type
 */

const productComments: ISchemaLevelResolver<
  IProduct,
  TContext,
  TCommentGetAllArgs,
  Promise<TConnection<IComment>>
> = async (product, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TCommentGetAllFilter>(args);

  const { count, payload } = await services.commentServices.getAll(
    { offset, limit },
    { field, direction },
    {
      // to get only top-level comments but user can override this filter
      replyToId: null,
      ...filter,
      productId: product.id.toString(),
    }
  );

  return {
    count,
    pageInfo: {
      offset,
      limit,
      hasNextPage: offset + limit < count,
    },
    edges: payload.map((comment) => ({
      cursor: comment.id,
      node: comment,
    })),
  };
};

/**
 * Resolver for `Product.rating.mean` type
 */

const productRatingMean: ISchemaLevelResolver<
  { product: IProduct },
  TContext,
  any,
  Promise<number>
> = async (parent, _args, ctx, _info) => {
  const { services } = ctx;
  const { product } = parent;

  const meanRating = await services.productServices.getMeanRating(
    product.id.toString()
  );

  return meanRating;
};

/**
 * Resolver for `Product.rating.list` query
 **/

const productRatingList: ISchemaLevelResolver<
  { product: IProduct },
  TContext,
  TRatingGetAllArgs,
  Promise<TConnection<IRating>>
> = async (parent, args, ctx, _info) => {
  const { services } = ctx;
  const { product } = parent;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TRatingGetAllFilter>(args);

  const { count, payload } = await services.ratingServices.getAll(
    { offset, limit },
    { field, direction },
    { ...filter, productId: product.id.toString() }
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

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    productGetAll,
    productGetOne,
    productGetAllCategories,
  },
  Product: {
    owner: productOwner,
    comments: productComments,
    rating: (parent: IProduct) => ({ product: parent }), // this is a hack to make `Product.rating` type work
  },
  ProductRating: {
    mean: productRatingMean,
    list: productRatingList,
  },
};
