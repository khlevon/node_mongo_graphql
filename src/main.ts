import express, { NextFunction, Request, Response } from "express";
import logger from "./app/common/logger";
import dbConnector from "./app/db/connector";
import appConfigs from "./app/configs/app.configs";
import { bootstrap as bootstrapGraphQL } from "./app/api/graphql/server";
import { createAppContextMiddleware } from "./app/common/contextCreator";

async function bootstrap() {
  // connect to db
  await dbConnector;

  const app = express();

  const [host, port] = appConfigs.get(["APP_HOST", "APP_PORT"]);

  app.use(createAppContextMiddleware);

  const { path: graphqlPath } = await bootstrapGraphQL(app);

  app.use((req, res) => {
    res.status(404).json({
      message: `Not found`,
      path: req.path,
    });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(500).send({
      message: "Internal server error",
    });
  });

  await new Promise<void>((resolve) =>
    app.listen(
      {
        host,
        port,
      },
      resolve
    )
  );

  return {
    graphqlUrl: `http://${host}:${port}${graphqlPath}`,
  };
}

bootstrap()
  .then(({ graphqlUrl }) => {
    logger.info(`🚀 Server ready: graphqlUrl=${graphqlUrl}`);
  })
  .catch((err) => {
    logger.error(err);
  });
