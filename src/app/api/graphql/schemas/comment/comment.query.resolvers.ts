import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { getConnectionMetadata } from "../../../../common/utils";
import { TContext } from "../../../../../types/graphql";
import { TConnection } from "../../../../../types/graphql";
import { IComment } from "../../../../modules/comment/comment.model";
import { IProduct } from "../../../../modules/product/product.model";
import { IUser } from "../../../../modules/user/user.model";
import { TComment } from "../../../../modules/comment/comment.entity";
import {
  TCommentGetAllArgs,
  TCommentGetAllFilter,
  TCommentGetOneArgs,
} from "./comment.inputs";

// Types

/**
 * Resolver for `commentGetAll` query
 **/

const commentGetAll: ISchemaLevelResolver<
  any,
  TContext,
  TCommentGetAllArgs,
  Promise<TConnection<IComment>>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TCommentGetAllFilter>(args);

  const { count, payload } = await services.commentServices.getAll(
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
    edges: payload.map((comment) => ({
      cursor: comment.id,
      node: comment,
    })),
  };
};

/**
 * Resolver for `commentGetOne` query
 **/

const commentGetOne: ISchemaLevelResolver<
  any,
  TContext,
  TCommentGetOneArgs,
  Promise<IComment>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const comment = await services.commentServices.getOneById(id);

  return comment;
};

/**
 * Resolver for `Comment.owner` type
 */

const commentOwner: ISchemaLevelResolver<
  TComment,
  TContext,
  any,
  Promise<IUser>
> = async (comment, _args, ctx, _info) => {
  const { services } = ctx;
  const { ownerId } = comment;

  const user = await services.userService.getOneById(ownerId.toString());

  return user;
};

/**
 * Resolver for `Comment.product` type
 */

const commentProduct: ISchemaLevelResolver<
  TComment,
  TContext,
  any,
  Promise<IProduct>
> = async (comment, _args, ctx, _info) => {
  const { services } = ctx;
  const { productId } = comment;

  const product = await services.productServices.getOneById(
    productId.toString()
  );

  return product;
};

/**
 * Resolver for `Comment.replyTo` type
 */

const commentReplyTo: ISchemaLevelResolver<
  TComment,
  TContext,
  any,
  Promise<IComment | null>
> = async (comment, _args, ctx, _info) => {
  const { services } = ctx;
  const { replyToId } = comment;

  let replyTo: IComment | null = null;

  if (replyToId) {
    replyTo = await services.commentServices.getOneById(replyToId.toString());
  }

  return replyTo;
};

/**
 * Resolver for `Comment.replies` type
 */

const commentReplies: ISchemaLevelResolver<
  any,
  TContext,
  TCommentGetAllArgs,
  Promise<TConnection<IComment>>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const {
    filter,
    pagination: { offset, limit },
    orderBy: { field, direction },
  } = getConnectionMetadata<TCommentGetAllFilter>(args);

  const { count, payload } = await services.commentServices.getAll(
    { offset, limit },
    { field, direction },
    { ...filter, replyToId: _parent.id }
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

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    commentGetAll,
    commentGetOne,
  },
  Comment: {
    owner: commentOwner,
    product: commentProduct,
    replyTo: commentReplyTo,
    replies: commentReplies,
  },
};
