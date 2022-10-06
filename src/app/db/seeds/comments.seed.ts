import { Connection, Types } from "mongoose";
import { MongoServerError } from "mongodb";
import { getRandomInt, toObjectId } from "../../common/utils";
import { fetchNextChunk } from "./api";
import logger from "../../common/logger";
import { TComment } from "../../modules/comment/comment.entity";

export default async function start(
  db: Connection,
  userIdsMapping: { [key: string]: string },
  productIdsMapping: { [key: string]: string }
) {
  const collection = db.collection<
    Omit<TComment, "productId"> & { productId: Types.ObjectId }
  >("comments");
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
    const { comments } = await fetchNextChunk("comments", skip, limit);

    if (!comments.length) {
      break;
    }

    const idMappingEntries: [any, any][] = [];

    const data = await Promise.all(
      comments.map(async (comment: any, i: number) => {
        const { id, body, user, postId } = comment;

        const productId = postId > 100 ? postId - 100 : postId;
        const ownerId = user.id;

        let replyToId: string | null = null;

        if (i % 3) {
          const productComments = await collection
            .find({ productId: toObjectId(productIdsMapping[productId]) })
            .toArray();

          if (productComments.length) {
            replyToId = productComments[
              getRandomInt(0, productComments.length - 1)
            ]._id.toString();
          }
        }

        idMappingEntries.push([id, undefined]);

        return {
          body,
          productId: toObjectId(productIdsMapping[productId]),
          ownerId: toObjectId(userIdsMapping[ownerId]),
          replyToId: replyToId ? toObjectId(replyToId) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    const res = await collection.insertMany(data);

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
