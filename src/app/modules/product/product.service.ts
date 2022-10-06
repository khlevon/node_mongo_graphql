import { TOrderBy, TPagination } from "../../../types/app";
import { BaseService } from "../../common/base/service";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { AppError } from "../../common/errors/app.error";
import { toObjectId } from "../../common/utils";
import { RatingRepository } from "../rating/rating.repository";
import { TProduct } from "./product.entity";
import { IProduct } from "./product.model";
import { ProductRepository } from "./product.repository";

class ProductService extends BaseService<IProduct> {
  protected repos: {
    productRepository: ProductRepository;
    ratingRepository: RatingRepository;
  };

  constructor(
    productRepository: ProductRepository,
    ratingRepository: RatingRepository
  ) {
    super();
    this.repos = {
      productRepository,
      ratingRepository,
    };
  }

  public async getAll(
    pagination: Required<TPagination> = {
      offset: 0,
      limit: 0,
    },
    orderBy: Required<TOrderBy> = {
      field: "createdAt",
      direction: "desc",
    },
    filter: { category?: string; ownerId?: string; isBlocked?: boolean } = {}
  ) {
    const { count, products } = await this.repos.productRepository.getAll(
      pagination,
      orderBy,
      filter
    );

    return {
      count,
      payload: products,
    };
  }

  public async getOneById(id: string) {
    const product = await this.repos.productRepository.getOne({ id });

    if (!product) {
      throw new AppError("Product not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return product;
  }

  public async getAllCategories() {
    const categories = await this.repos.productRepository.getAllCategories();

    return categories;
  }

  public async getMeanRating(id: string) {
    const data = await this.repos.ratingRepository.runAggregation<{
      meanRating: number;
    }>([
      {
        $match: {
          productId: toObjectId(id),
        },
      },
      {
        $group: {
          _id: "$productId",
          meanRating: {
            $avg: "$score",
          },
        },
      },
    ]);

    return data.length ? Number(data[0].meanRating.toFixed(3)) : 0;
  }

  public async createOne(data: TProduct) {
    const product = await this.repos.productRepository.create(data);

    return product;
  }

  public async updateById(id: string, data: Partial<TProduct>) {
    const product = await this.repos.productRepository.updateOne(id, data);

    if (!product) {
      throw new AppError("Product not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return product;
  }

  public async setBlocked(id: string, isBlocked: boolean) {
    const product = await this.repos.productRepository.updateOneExtended(id, {
      $set: { isBlocked },
    });

    if (!product) {
      throw new AppError("Product not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return product;
  }
}

export { ProductService };
