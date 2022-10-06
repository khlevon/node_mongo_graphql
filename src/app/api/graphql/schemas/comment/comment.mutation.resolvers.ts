import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";
import { AppError } from "../../../../common/errors/app.error";
import { IComment } from "../../../../modules/comment/comment.model";
import { TCommentCreateArgs, TCommentDeleteArgs } from "./comment.inputs";

/**
 * Resolver for `commentCreate` mutation
 **/

const commentCreate: ISchemaLevelResolver<
  any,
  TContext,
  TCommentCreateArgs,
  Promise<IComment>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { input } = args;

  const ownerId = ctx.user?.id;

  if (!ownerId) {
    throw new AppError("Unauthorized", {
      status: HTTPStatuses.UNAUTHORIZED,
    });
  }

  const comment = await services.commentServices.createOne({
    ...input,
    ownerId,
  });

  return comment;
};

/**
 * Resolver for `commentDelete` mutation
 **/

const commentDelete: ISchemaLevelResolver<
  any,
  TContext,
  TCommentDeleteArgs,
  Promise<IComment>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const comment = await services.commentServices.deleteOneById(id);

  return comment;
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    commentCreate,
    commentDelete,
  },
};
