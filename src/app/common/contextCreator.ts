import appConfigs from "../configs/app.configs";
import { WithId } from "../../types/utils";
import { TUser } from "../modules/user/user.entity";
import { NextFunction, Request, Response } from "express";
import { isObject } from "lodash";
import { TAppContextServices } from "../../types/app";
import { AuthService } from "../modules/auth/auth.service";
import { UserService } from "../modules/user/user.service";
import { UserRepository } from "../modules/user/user.repository";
import { ProductRepository } from "../modules/product/product.repository";
import { ProductService } from "../modules/product/product.service";
import { CommentService } from "../modules/comment/comment.service";
import { CommentRepository } from "../modules/comment/comment.repository";
import { RatingService } from "../modules/rating/rating.service";
import { RatingRepository } from "../modules/rating/rating.repository";
import { TransactionService } from "../modules/transaction/transaction.service";
import { TransactionRepository } from "../modules/transaction/transaction.repository";
import { AppError } from "./errors/app.error";
import { HTTPStatuses } from "./constants/httpStatuses";

const [JWT_SECRET] = appConfigs.get(["JWT_SECRET"]);

const createServices = (): TAppContextServices => {
  return {
    authService: new AuthService(new UserRepository()),
    userService: new UserService(
      new UserRepository(),
      new ProductRepository(),
      new TransactionRepository()
    ),
    productServices: new ProductService(
      new ProductRepository(),
      new RatingRepository()
    ),
    commentServices: new CommentService(new CommentRepository()),
    ratingServices: new RatingService(
      new RatingRepository(),
      new TransactionRepository()
    ),
    transactionService: new TransactionService(
      new TransactionRepository(),
      new UserRepository(),
      new ProductRepository()
    ),
  };
};

export const createAppContext = async (authorizationHeader?: string) => {
  const services = createServices();

  let authUser: WithId<TUser> | null = null;

  if (authorizationHeader) {
    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorization header", {
        status: HTTPStatuses.BAD_REQUEST,
      });
    }

    const token = authorizationHeader.split("Bearer ")[1] || "";

    const isTokenValid = services.authService.verifyToken(token, JWT_SECRET);
    const tokenData = services.authService.decodeToken(token) || {
      payload: {},
    };

    const invalidTokenError = new AppError("Invalid token", {
      status: HTTPStatuses.BAD_REQUEST,
    });

    if (token) {
      if (!isTokenValid) throw invalidTokenError;

      try {
        const id = (tokenData.payload as any).uid;
        const user = await services.userService.getOneById(id);
        authUser = (user as unknown) as WithId<TUser>;
      } catch {
        throw invalidTokenError;
      }
    }

    if (authUser && authUser.isBlocked) {
      throw new AppError("User is blocked", {
        status: HTTPStatuses.FORBIDDEN,
      });
    }
  }

  return {
    services,
    user: authUser,
  };
};

export const createAppContextMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const appContext = await createAppContext(req.headers.authorization);

    if (!isObject(req.locals)) {
      req.locals = {} as any;
    }

    req.locals = {
      ...req.locals,
      ...appContext,
    };

    next();
  } catch (err) {
    next(err);
  }
};
