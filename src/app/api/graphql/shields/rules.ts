import { rule } from "graphql-shield";
import { TContext } from "../../../../types/graphql";
import { WithId } from "../../../../types/utils";
import { EUserRole, TUser } from "../../../modules/user/user.entity";

export const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  if (!ctx.user) {
    return false;
  }
  return true;
});

export const isOwner = <TParent = any, TArgs = any>(
  checkFn: (
    currentUser: WithId<TUser>,
    ctx: TContext,
    parent: TParent,
    args: TArgs,
    info: any
  ) => Promise<boolean> | boolean
) =>
  rule()(async (parent, args, ctx, info) => {
    if (!ctx.user) {
      return false;
    }

    return await checkFn(ctx.user, ctx, parent, args, info);
  });

export const hasRole = (role: EUserRole) =>
  rule()(async (parent, args, ctx, info) => {
    return role === ctx.user?.role;
  });
