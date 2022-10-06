import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";
import { AppError } from "../../../../common/errors/app.error";
import { IUser } from "../../../../modules/user/user.model";

/**
 * Resolver for `authMe` query
 **/

const authMe: ISchemaLevelResolver<any, TContext, any, Promise<IUser>> = async (
  _parent,
  _args,
  ctx,
  _info
) => {
  const { user, services } = ctx;

  if (!user)
    throw new AppError("Unauthenticated", {
      status: HTTPStatuses.UNAUTHORIZED,
    });

  const authUser = await services.userService.getOneById(user.id);

  return authUser;
};

// Register resolvers
export const Resolvers: IResolvers<any, TContext> = {
  Query: {
    authMe,
  },
};
