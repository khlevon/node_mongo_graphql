import { Types } from "mongoose";
import { TOrderBy, TPagination } from "../../../types/app";
import { BaseService } from "../../common/base/service";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { AppError } from "../../common/errors/app.error";
import { toObjectId } from "../../common/utils";
import { IProduct } from "../product/product.model";
import { ProductRepository } from "../product/product.repository";
import { UserRepository } from "../user/user.repository";
import { TTransactionProduct } from "./transaction.entity";
import { ITransaction } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";

class TransactionService extends BaseService<ITransaction> {
  protected repos: {
    transactionRepository: TransactionRepository;
    userRepository: UserRepository;
    productRepository: ProductRepository;
  };

  constructor(
    transactionRepository: TransactionRepository,
    userRepository: UserRepository,
    productRepository: ProductRepository
  ) {
    super();
    this.repos = {
      transactionRepository,
      userRepository,
      productRepository,
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
    filter: { ownerId?: string } = {}
  ) {
    const {
      count,
      transactions,
    } = await this.repos.transactionRepository.getAll(
      pagination,
      orderBy,
      filter
    );

    return {
      count,
      payload: transactions,
    };
  }

  public async getOneById(id: string) {
    const transaction = await this.repos.transactionRepository.getOneById(id);

    if (!transaction) {
      throw new AppError("Transaction not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return transaction;
  }

  public async createOne(data: {
    ownerId: string;
    products: { productId: string; quantity: number }[];
  }) {
    const user = await this.repos.userRepository.getOneById(data.ownerId);

    if (!user) {
      throw new AppError("User not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    const productToQuantityMapping = data.products.reduce((acc, product) => {
      if (!acc[product.productId]) {
        acc[product.productId] = 0;
      }

      acc[product.productId] += product.quantity;

      return acc;
    }, {} as Record<string, number>);

    const transactionProducts = await this.repos.productRepository.getAllByFilter(
      {
        _id: {
          $in: Object.keys(productToQuantityMapping).map((productId) =>
            toObjectId(productId)
          ),
        },
      }
    );

    const transactionProductsMap = transactionProducts.reduce(
      (acc, product) => {
        acc[product.id.toString()] = product;
        return acc;
      },
      {} as Record<
        string,
        IProduct & {
          _id: Types.ObjectId;
        }
      >
    );

    const transactionDataProducts: TTransactionProduct[] = [];
    let totalAmount: number = 0;

    for (const [productId, quantity] of Object.entries(
      productToQuantityMapping
    )) {
      const product = transactionProductsMap[productId];

      if (!product) {
        throw new AppError("Product not found", {
          status: HTTPStatuses.NOT_FOUND,
        });
      }

      if (product.isBlocked) {
        throw new AppError("Product is blocked", {
          status: HTTPStatuses.CONFLICT,
        });
      }

      if (product.stock < quantity) {
        throw new AppError("Product quantity is not enough", {
          status: HTTPStatuses.CONFLICT,
        });
      }

      let amount = product.price * quantity;

      if (product.discountPercentage) {
        amount -= (amount * product.discountPercentage) / 100;
      }

      amount = Number(amount.toFixed(3));

      totalAmount += amount;

      transactionDataProducts.push({
        productId: product.id.toString(),
        quantity,
        amount,
      });
    }

    totalAmount = Number(totalAmount.toFixed(3));

    if (user.balance < totalAmount) {
      throw new AppError("User balance is not enough", {
        status: HTTPStatuses.CONFLICT,
      });
    }

    // TODO: add transaction rollback if any error occurs

    await this.repos.userRepository.updateOneExtended(data.ownerId, {
      balance: {
        $subtract: ["$balance", totalAmount],
      },
    });

    await Promise.all(
      Object.keys(productToQuantityMapping).map((productId) => {
        return this.repos.productRepository.updateOneExtended(productId, {
          stock: {
            $subtract: ["$stock", productToQuantityMapping[productId]],
          },
        });
      })
    );

    const transaction = await this.repos.transactionRepository.create({
      products: transactionDataProducts,
      totalAmount,
      ownerId: data.ownerId,
    });

    return transaction;
  }
}

export { TransactionService };
