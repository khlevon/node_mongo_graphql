import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { AggregateOptions } from "mongodb";
import { toObjectId } from "../../common/utils";
import { TOrderBy, TPagination } from "../../../types/app";
import { TProduct } from "./product.entity";
import Product, { IProduct } from "./product.model";
import { isUndefined, pickBy } from "lodash";
import { BaseRepository } from "../../common/base/repository";

class ProductRepository extends BaseRepository<IProduct> {
  public runAggregation = async <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => {
    return await Product.aggregate<R>(pipeline, options);
  };

  public isUserOwn = async (userId: string, id: string) => {
    const product = await Product.findOne({
      id: toObjectId(id),
      ownerId: toObjectId(userId),
    });

    return !!product;
  };

  public getAllByFilter = async (filter: FilterQuery<IProduct>) => {
    return await Product.find(filter);
  };

  public getAll = async (
    pagination: Required<TPagination>,
    orderBy: Required<TOrderBy>,
    filter: FilterQuery<IProduct>
  ) => {
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({
        [orderBy.field]: orderBy.direction,
      })
      .skip(pagination.offset)
      .limit(pagination.limit);

    return {
      count,
      products,
    };
  };

  public getOne = async (filter: FilterQuery<TProduct>) => {
    const product = await Product.findOne(filter);

    return product;
  };

  public getOneById = async (id: string) => {
    const product = await Product.findById(toObjectId(id));

    return product;
  };

  public getAllCategories = async (): Promise<string[]> => {
    const categories = await Product.distinct("category");

    return categories;
  };

  public getProductIdsByOwner = async (ownerId: string) => {
    const productIds = await Product.distinct("_id", {
      ownerId: toObjectId(ownerId),
    });

    return productIds;
  };

  public create = async (data: TProduct) => {
    const product = await Product.create(data);

    return product;
  };

  public updateOne = async (id: string, productData: Partial<TProduct>) => {
    const updatedProduct = await Product.findByIdAndUpdate(
      toObjectId(id),
      {
        $set: pickBy(productData, (v) => !isUndefined(v)),
      },
      {
        new: true,
      }
    );

    return updatedProduct;
  };

  public updateOneExtended = async (
    id: string,
    updateQuery: UpdateQuery<IProduct>
  ) => {
    const updatedProduct = await Product.findByIdAndUpdate(
      toObjectId(id),
      updateQuery,
      {
        new: true,
      }
    );

    return updatedProduct;
  };
}

export { ProductRepository };
