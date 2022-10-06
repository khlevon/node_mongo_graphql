import { AuthService } from "../app/modules/auth/auth.service";
import { CommentService } from "../app/modules/comment/comment.service";
import { ProductService } from "../app/modules/product/product.service";
import { RatingService } from "../app/modules/rating/rating.service";
import { TransactionService } from "../app/modules/transaction/transaction.service";
import { TUser } from "../app/modules/user/user.entity";
import { UserService } from "../app/modules/user/user.service";
import { WithId } from "./utils";

export type TAppContextServices = {
  authService: AuthService;
  userService: UserService;
  productServices: ProductService;
  commentServices: CommentService;
  ratingServices: RatingService;
  transactionService: TransactionService;
};

export type TAppContext = {
  services: TAppContextServices;
  user: WithId<TUser> | null;
};

export type TPagination = {
  offset?: number;
  limit?: number;
};

export type TOrderBy = {
  field?: string;
  direction?: SortOrder;
};

// Change global types

declare global {
  namespace Express {
    export interface Request {
      locals: TAppContext;
    }
  }

  interface Error {
    toJSON: () => object;
  }
}
