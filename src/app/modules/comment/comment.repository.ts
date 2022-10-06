import { FilterQuery, PipelineStage } from "mongoose";
import { AggregateOptions } from "mongodb";
import { toObjectId } from "../../common/utils";
import { TOrderBy, TPagination } from "../../../types/app";
import Comment, { IComment } from "./comment.model";
import { TComment } from "./comment.entity";
import { BaseRepository } from "../../common/base/repository";

class CommentRepository extends BaseRepository<IComment> {
  public runAggregation = async <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => {
    return await Comment.aggregate<R>(pipeline, options);
  };

  public isUserOwn = async (userId: string, id: string) => {
    const comment = await Comment.findOne({
      id: toObjectId(id),
      ownerId: toObjectId(userId),
    });

    return !!comment;
  };

  public getAll = async (
    pagination: Required<TPagination>,
    orderBy: Required<TOrderBy>,
    filter: FilterQuery<IComment>
  ) => {
    const count = await Comment.countDocuments(filter);
    const comments = await Comment.find(filter)
      .sort({
        [orderBy.field]: orderBy.direction,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);

    return {
      count,
      comments,
    };
  };

  public getOne = async (filter: FilterQuery<TComment>) => {
    const comment = await Comment.findOne(filter);

    return comment;
  };

  public getOneById = async (id: string) => {
    const comment = await Comment.findById(toObjectId(id));

    return comment;
  };

  public create = async (data: TComment) => {
    const comment = await Comment.create(data);

    return comment;
  };

  public deleteOne = async (filter: FilterQuery<TComment>) => {
    const res = await Comment.deleteOne(filter);

    return res;
  };
}

export { CommentRepository };
