import { Connection } from "mongoose";
import { MongoServerError } from "mongodb";
import { getRandomInt, toObjectId } from "../../common/utils";
import { fetchNextChunk } from "./api";
import logger from "../../common/logger";
import { TProduct } from "../../modules/product/product.entity";

export default async function start(
  db: Connection,
  userIdsMapping: { [key: string]: string }
) {
  const collection = db.collection<TProduct>("products");
  try {
    await collection.drop();
  } catch (e) {
    if (!(e instanceof MongoServerError && e.code === 26)) {
      logger.debug(e);
    }
  }

  let idMapping = {};

  let skip = 0;
  const limit = 100;
  while (true) {
    const { products } = await fetchNextChunk("products", skip, limit);

    if (!products.length) {
      break;
    }

    const idMappingEntries: [any, any][] = [];

    const res = await collection.insertMany(
      products.map((product: any) => {
        const {
          id,
          title,
          description,
          price,
          discountPercentage,
          stock,
          brand,
          category,
          thumbnail,
          images,
        } = product;

        const ownerId = getRandomInt(
          1,
          Math.floor(Object.keys(userIdsMapping).length / 2) // choose only from the first half of users
        );

        idMappingEntries.push([id, undefined]);

        return {
          title,
          description,
          price,
          discountPercentage,
          stock,
          brand,
          category,
          thumbnail,
          images,
          ownerId: toObjectId(userIdsMapping[ownerId]),
          isBlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    Object.keys(res.insertedIds).forEach((index) => {
      idMappingEntries[index][1] = res.insertedIds[index].toString();
    });

    idMapping = {
      ...idMapping,
      ...Object.fromEntries(idMappingEntries),
    };

    skip += limit;
  }

  return idMapping;
}
