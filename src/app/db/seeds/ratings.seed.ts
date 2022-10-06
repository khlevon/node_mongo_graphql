import { Connection } from "mongoose";
import { MongoServerError } from "mongodb";
import { getRandomInt } from "../../common/utils";
import logger from "../../common/logger";
import { TRating } from "../../modules/rating/rating.entity";
import { TTransaction } from "../../modules/transaction/transaction.entity";

export default async function start(db: Connection) {
  const ratingsColl = db.collection<TRating>("ratings");
  const transactionsColl = db.collection<TTransaction>("transactions");

  try {
    await ratingsColl.drop();
  } catch (e) {
    if (!(e instanceof MongoServerError && e.code === 26)) {
      logger.debug(e);
    }
  }

  const transactions = await transactionsColl.find().toArray();

  const ratings: TRating[] = [];

  for (const transaction of transactions) {
    for (const product of transaction.products) {
      const rating = {
        ownerId: transaction.ownerId,
        productId: product.productId,
        score: getRandomInt(1, 5),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ratings.push(rating);
    }
  }

  await ratingsColl.insertMany(ratings);
}
