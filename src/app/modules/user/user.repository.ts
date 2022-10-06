import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { AggregateOptions } from "mongodb";
import { isUndefined, pickBy } from "lodash";
import { BaseRepository } from "../../common/base/repository";
import { TOrderBy, TPagination } from "../../../types/app";
import { TUser } from "./user.entity";
import User, { IUser } from "./user.model";
import { toObjectId } from "../../common/utils";

class UserRepository extends BaseRepository<IUser> {
  public runAggregation = async <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => {
    return await User.aggregate<R>(pipeline, options);
  };

  public isUserOwn = async (_userId: string, _id: string) => false;

  public getAll = async (
    pagination: Required<TPagination>,
    orderBy: Required<TOrderBy>,
    filter: FilterQuery<IUser>
  ) => {
    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({
        [orderBy.field]: orderBy.direction,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);

    return {
      count,
      users,
    };
  };

  public getOne = async (filter: FilterQuery<TUser>) => {
    const user = await User.findOne(filter);

    return user;
  };

  public getOneById = async (id: string) => {
    const user = await User.findById(toObjectId(id));

    return user;
  };

  public create = async (user: TUser) => {
    const newUser = await User.create(user);

    return newUser;
  };

  public updateOne = async (id: string, userData: Partial<TUser>) => {
    const updatedUser = await User.findByIdAndUpdate(
      toObjectId(id),
      {
        $set: pickBy(userData, (v) => !isUndefined(v)),
      },
      {
        new: true,
      }
    );

    return updatedUser;
  };

  public updateOneExtended = async (
    id: string,
    updateQuery: UpdateQuery<IUser>
  ) => {
    const updatedUser = await User.findByIdAndUpdate(
      toObjectId(id),
      updateQuery,
      {
        new: true,
      }
    );

    return updatedUser;
  };
}

export { UserRepository };
