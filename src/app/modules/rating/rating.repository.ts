import { FilterQuery, PipelineStage } from "mongoose";
import { AggregateOptions } from "mongodb";
import { TOrderBy, TPagination } from "../../../types/app";
import { TRating } from "./rating.entity";
import Rating, { IRating } from "./rating.model";
import { toObjectId } from "../../common/utils";
import { BaseRepository } from "../../common/base/repository";

class RatingRepository extends BaseRepository<IRating> {
  public runAggregation = async <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => {
    return await Rating.aggregate<R>(pipeline, options);
  };

  public isUserOwn = async (userId: string, id: string) => {
    const rating = await Rating.findOne({
      id: toObjectId(id),
      ownerId: toObjectId(userId),
    });

    return !!rating;
  };

  public getAll = async (
    pagination: Required<TPagination>,
    orderBy: Required<TOrderBy>,
    filter: FilterQuery<IRating>
  ) => {
    const count = await Rating.countDocuments(filter);
    const ratings = await Rating.find(filter)
      .sort({
        [orderBy.field]: orderBy.direction,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);

    return {
      count,
      ratings,
    };
  };

  public getOne = async (filter: FilterQuery<TRating>) => {
    const rating = await Rating.findOne(filter);

    return rating;
  };

  public getOneById = async (id: string) => {
    const rating = await Rating.findById(toObjectId(id));

    return rating;
  };

  public create = async (data: TRating) => {
    const rating = await Rating.create(data);

    return rating;
  };

  public deleteOne = async (filter: FilterQuery<TRating>) => {
    const res = await Rating.deleteOne(filter);
    return res;
  };
}

export { RatingRepository };
