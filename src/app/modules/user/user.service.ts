import { TOrderBy, TPagination } from "../../../types/app";
import { BaseService } from "../../common/base/service";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { AppError } from "../../common/errors/app.error";
import { ProductRepository } from "../product/product.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { EUserGender, EUserRole, TUser } from "./user.entity";
import { IUser } from "./user.model";
import { UserRepository } from "./user.repository";

class UserService extends BaseService<IUser> {
  protected repos: {
    userRepository: UserRepository;
    productRepository: ProductRepository;
    transactionRepository: TransactionRepository;
  };

  constructor(
    userRepository: UserRepository,
    productRepository: ProductRepository,
    transactionRepository: TransactionRepository
  ) {
    super();
    this.repos = {
      userRepository,
      productRepository,
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
    filter: {
      username?: string;
      gender?: EUserGender;
    } = {}
  ) {
    const { count, users } = await this.repos.userRepository.getAll(
      pagination,
      orderBy,
      filter
    );

    return {
      count,
      payload: users,
    };
  }

  public async getOneById(id: string) {
    const user = await this.repos.userRepository.getOne({ id });

    if (!user) {
      throw new AppError("User not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return user;
  }

  public async getOneByUsername(username: string) {
    const user = await this.repos.userRepository.getOne({ username });

    if (!user) {
      throw new AppError("User not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return user;
  }

  public async getGrossRevenueByUserId(
    id: string,
    startDate: Date,
    endDate: Date
  ) {
    const userProductIds = await this.repos.productRepository.getProductIdsByOwner(
      id
    );

    const data = await this.repos.transactionRepository.runAggregation<{
      totalGrossRevenue: number;
    }>([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          products: {
            $elemMatch: {
              productId: {
                $in: userProductIds,
              },
            },
          },
        },
      },
      {
        $project: {
          revenueFromTransaction: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$products",
                    as: "product",
                    cond: {
                      $in: ["$$product.productId", userProductIds],
                    },
                  },
                },
                as: "product",
                in: "$$product.amount",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalGrossRevenue: {
            $sum: "$revenueFromTransaction",
          },
        },
      },
    ]);

    return data.length ? data[0].totalGrossRevenue : 0;
  }

  public async updateById(id: string, data: Partial<TUser>) {
    const user = await this.repos.userRepository.updateOne(id, data);

    if (!user) {
      throw new AppError("User not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return user;
  }

  public async updateBalance(id: string, amount: number) {
    const user = await this.repos.userRepository.updateOneExtended(id, {
      balance: {
        $inc: amount,
      },
    });

    if (!user) {
      throw new AppError("User not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return user;
  }

  public async setBlocked(
    id: string,
    isBlocked: boolean,
    options: { executorRole: EUserRole } = { executorRole: EUserRole.USER }
  ) {
    const userNotFoundError = new AppError(`User not found`, {
      status: HTTPStatuses.NOT_FOUND,
    });

    let user = await this.repos.userRepository.getOneById(id);

    if (!user) {
      throw userNotFoundError;
    }

    // Only admin can block/unblock other admins
    if (
      user.role === EUserRole.ADMIN &&
      options.executorRole !== EUserRole.ADMIN
    ) {
      throw new AppError(`Unauthorized`, {
        status: HTTPStatuses.UNAUTHORIZED,
      });
    }

    user = await this.repos.userRepository.updateOneExtended(id, {
      $set: { isBlocked },
    });

    if (!user) {
      throw userNotFoundError;
    }

    return user;
  }
}

export { UserService };
