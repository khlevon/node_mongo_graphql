import { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "@graphql-tools/schema";

import logger from "../../common/logger";
import appConfigs from "../../configs/app.configs";
import { TContext } from "../../../types/graphql";
import { typeDefs, resolvers } from "./schemas";
import { shieldsSchema } from "./shields";
import { AppError } from "../../common/errors/app.error";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { ValidationError } from "yup";
import { processError } from "../../common/errors/processError";
import { GraphQLError } from "graphql";

const [IS_PROD] = appConfigs.get(["IS_PROD"]);

export const bootstrap = async (app: Express) => {
  const server = new ApolloServer<TContext>({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      shieldsSchema
    ),
    introspection: !IS_PROD,
    formatError(error) {
      let appError: AppError;

      if (error.originalError instanceof ValidationError) {
        appError = new AppError(error.originalError.message, {
          status: HTTPStatuses.BAD_REQUEST,
          data: {
            path: error.originalError.path,
            params: error.originalError.params,
          },
          originalError: error,
        });
      } else if (!(error.originalError instanceof AppError)) {
        logger.error(error);

        appError = new AppError(error.message, {
          status: HTTPStatuses.BAD_REQUEST,
          data: {
            locations: error.locations,
            path: error.path,
          },
          originalError: error,
        });
      } else {
        appError = error.originalError;
      }

      if (appError.status === HTTPStatuses.INTERNAL_SERVER_ERROR) {
        logger.error(appError);
      }

      return processError(appError);
    },
    context: async (ctx) => {
      return {
        ...ctx.req.locals,
        req: ctx.req,
        res: ctx.res,
      };
    },
  });

  const path = "/graphql";

  await server.start();

  server.applyMiddleware({ app, path });

  return { app, path };
};
