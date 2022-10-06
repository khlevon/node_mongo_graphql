import { TOrderBy, TPagination } from "../../../types/app";
import { BaseService } from "../../common/base/service";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { AppError } from "../../common/errors/app.error";
import { toObjectId } from "../../common/utils";
import { TransactionRepository } from "../transaction/transaction.repository";
import { TRating } from "./rating.entity";
import { IRating } from "./rating.model";
import { RatingRepository } from "./rating.repository";

class RatingService extends BaseService<IRating> {
  protected repos: {
    ratingRepository: RatingRepository;
    transactionRepository: TransactionRepository;
  };

  constructor(
    ratingRepository: RatingRepository,
    transactionRepository: TransactionRepository
  ) {
    super();
    this.repos = {
      ratingRepository,
      transactionRepository,
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
    filter: {} = {}
  ) {
    const { count, ratings } = await this.repos.ratingRepository.getAll(
      pagination,
      orderBy,
      filter
    );

    return {
      count,
      payload: ratings,
    };
  }

  public async getOneById(id: string) {
    const rating = await this.repos.ratingRepository.getOne({ id });

    if (!rating) {
      throw new AppError("Rating not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return rating;
  }

  public async createOne(data: TRating) {
    const canUserRateProduct = await this.repos.transactionRepository.getOne({
      $and: [
        {
          $match: {
            ownerId: toObjectId(data.ownerId),
          },
        },
        {
          products: {
            $elemMatch: {
              productId: toObjectId(data.productId),
            },
          },
        },
      ],
    });

    if (!canUserRateProduct) {
      throw new AppError("Unauthorized", {
        status: HTTPStatuses.UNAUTHORIZED,
      });
    }

    const rating = await this.repos.ratingRepository.create(data);

    return rating;
  }

  public async deleteOneById(id: string) {
    const rating = await this.getOneById(id);

    await this.repos.ratingRepository.deleteOne({
      id: toObjectId(id),
    });

    return rating;
  }
}

export { RatingService };
