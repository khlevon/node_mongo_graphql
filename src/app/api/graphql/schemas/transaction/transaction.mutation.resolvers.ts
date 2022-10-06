import { IResolvers, ISchemaLevelResolver } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";
import { HTTPStatuses } from "../../../../common/constants/httpStatuses";
import { AppError } from "../../../../common/errors/app.error";
import { ITransaction } from "../../../../modules/transaction/transaction.model";
import { TTransactionCreateArgs } from "./transaction.input";

/**
 * Resolver for `transactionCreate` mutation
 **/

const transactionCreate: ISchemaLevelResolver<
  any,
  TContext,
  TTransactionCreateArgs,
  Promise<ITransaction>
> = async (_parent, args, ctx, _info) => {
  const { services } = ctx;
  const { input } = args;

  const ownerId = ctx.user?.id || "";

  if (!ownerId) {
    throw new AppError("Unauthorized", {
      status: HTTPStatuses.UNAUTHORIZED,
    });
  }

  const transaction = await services.transactionService.createOne({
    ...input,
    ownerId: ownerId,
  });

  return transaction;
};

export const Resolvers: IResolvers<any, TContext> = {
  Mutation: {
    transactionCreate,
  },
};
