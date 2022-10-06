import { FilterQuery, PipelineStage } from "mongoose";
import { AggregateOptions } from "mongodb";
import { BaseRepository } from "../../common/base/repository";
import { TOrderBy, TPagination } from "../../../types/app";
import { toObjectId } from "../../common/utils";
import { TTransaction } from "./transaction.entity";
import Transaction, { ITransaction } from "./transaction.model";

class TransactionRepository extends BaseRepository<ITransaction> {
  public runAggregation = async <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => {
    return await Transaction.aggregate<R>(pipeline, options);
  };

  public isUserOwn = async (userId: string, transactionId: string) => {
    const transaction = await Transaction.findOne({
      id: toObjectId(transactionId),
      ownerId: toObjectId(userId),
    });

    return !!transaction;
  };

  public getAll = async (
    pagination: Required<TPagination>,
    orderBy: Required<TOrderBy>,
    filter: FilterQuery<ITransaction>
  ) => {
    const count = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({
        [orderBy.field]: orderBy.direction,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);

    return {
      count,
      transactions,
    };
  };

  public getOne = async (filter: FilterQuery<TTransaction>) => {
    const transaction = await Transaction.findOne(filter);

    return transaction;
  };

  public getOneById = async (id: string) => {
    const transaction = await Transaction.findById(toObjectId(id));

    return transaction;
  };

  public create = async (data: TTransaction) => {
    const transaction = await Transaction.create(data);

    return transaction;
  };
}

export { TransactionRepository };
