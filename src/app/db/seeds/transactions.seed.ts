import { Connection, Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { getRandomInt, toObjectId } from "../../common/utils";
import logger from "../../common/logger";
import { TProduct } from "../../modules/product/product.entity";
import {
  TTransaction,
  TTransactionProduct,
} from "../../modules/transaction/transaction.entity";
import { TUser } from "../../modules/user/user.entity";

export default async function start(db: Connection) {
  const transactionsColl = db.collection<TTransaction>("transactions");
  const usersColl = db.collection<TUser>("users");
  const productsColl = db.collection<TProduct>("products");

  try {
    await transactionsColl.drop();
  } catch (e) {
    if (!(e instanceof MongoServerError && e.code === 26)) {
      logger.debug(e);
    }
  }

  const [userIds, productIds] = await Promise.all([
    usersColl.distinct("_id").then((ids) => ids.map((id) => id.toString())),
    productsColl.distinct("_id").then((ids) => ids.map((id) => id.toString())),
  ]);

  let transactionsCount = 100;

  // create ${transactionsCount} transactions for random users with random products
  while (transactionsCount--) {
    const ownerId = userIds[getRandomInt(0, userIds.length - 1)];
    const user = await usersColl.findOne({
      _id: toObjectId(ownerId),
    });

    if (!user) {
      continue;
    }

    const products: (Omit<TTransactionProduct, "productId"> & {
      productId: Types.ObjectId;
    })[] = [];
    let productsCount = getRandomInt(1, 5);
    let totalAmount = 0;

    while (productsCount--) {
      const productId = productIds[getRandomInt(0, productIds.length - 1)];
      const product = await productsColl.findOne({
        _id: toObjectId(productId),
      });
      if (!product) {
        continue;
      }
      const quantity = getRandomInt(1, 5);
      if (product.stock < quantity) {
        continue;
      }

      let amount = product.price * quantity;

      if (product.discountPercentage) {
        amount -= (amount * product.discountPercentage) / 100;
      }

      amount = Number(amount.toFixed(3));

      totalAmount += amount;

      products.push({
        productId: toObjectId(productId),
        quantity,
        amount,
      });
    }

    if (!products.length || user.balance < totalAmount) {
      continue;
    }

    totalAmount = Number(totalAmount.toFixed(3));

    const data: any = {
      ownerId: toObjectId(ownerId),
      products,
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await transactionsColl.insertOne(data);

    // here can be 3 bugs (but as this is one time seed, it's not a big deal)
    // 1. product stock can be set to negative value
    // 2. user balance can be set to negative value
    // 3. if one of the bellow operations fails, we need to rollback transaction
    await Promise.all(
      products.map(async (product) => {
        return await productsColl.updateOne(
          { _id: product.productId },
          { $inc: { stock: -product.quantity } }
        );
      })
    );

    await usersColl.updateOne(
      { _id: data.ownerId },
      {
        $inc: {
          balance: -totalAmount,
        },
      }
    );
  }
}
