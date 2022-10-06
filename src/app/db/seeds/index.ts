import { MongoServerError } from "mongodb";
import logger from "../../common/logger";
import dbConnector from "../connector";
import startUsersSeed from "./users.seed";
import startProductsSeed from "./products.seed";
import startCommentsSeed from "./comments.seed";
import startTransactionsSeed from "./transactions.seed";
import startRatingsSeed from "./ratings.seed";

async function main() {
  const db = (await dbConnector).connection;

  try {
    logger.info("Dropping all collections");
    try {
      await db.dropDatabase();
    } catch (e) {
      if (!(e instanceof MongoServerError && e.code === 26)) {
        logger.debug(e);
      }
    }

    logger.info("Starting db creation");

    logger.info("Starting users seed");
    const userIdsMapping = await startUsersSeed(db);

    logger.info("Starting products seed");
    const productIdsMapping = await startProductsSeed(db, userIdsMapping);

    logger.info("Starting comments seed");
    await startCommentsSeed(db, userIdsMapping, productIdsMapping);

    logger.info("Starting transactions seed");
    await startTransactionsSeed(db);

    logger.info("Starting ratings seed");
    await startRatingsSeed(db);

    logger.info("Finished db creation");
  } catch (e) {
    logger.info("Error while creating db");
    logger.error(e);
  } finally {
    await db.close();
  }
}

main().catch(logger.error);
