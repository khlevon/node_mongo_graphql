import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";
import { AppError } from "../../../../common/errors/app.error";
import { IRating } from "../../../../modules/rating/rating.model";
import { TRatingCreateArgs, TRatingDeleteArgs } from "./rating.input";

/**
 * Resolver for `ratingCreate` mutation
 **/

const ratingCreate: ISchemaLevelResolver<
  any,
  TContext,
  TRatingCreateArgs,
  Promise<IRating>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { input } = args;

  const ownerId = ctx.user?.id;

  if (!ownerId) {
    throw new AppError("Unauthorized", {
      status: HTTPStatuses.UNAUTHORIZED,
    });
  }

  const rating = await services.ratingServices.createOne({
    ...input,
    ownerId: ctx.user?.id as string,
  });

  return rating;
};

/**
 * Resolver for `ratingDelete` mutation
 **/

const ratingDelete: ISchemaLevelResolver<
  any,
  TContext,
  TRatingDeleteArgs,
  Promise<IRating>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { id } = args;

  const rating = await services.ratingServices.deleteOneById(id);

  return rating;
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    ratingCreate,
    ratingDelete,
  },
};
