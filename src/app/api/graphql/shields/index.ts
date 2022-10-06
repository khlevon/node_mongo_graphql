import { shield, and, or, inputRule, allow } from "graphql-shield";
import { EUserRole, TUser } from "../../../modules/user/user.entity";
import {
  AuthSignInArgsSchema,
  AuthSignUpArgsSchema,
} from "../schemas/auth/auth.validator";
import {
  UserGetOneByUsernameArgsSchema,
  UserGetAllArgsSchema,
  UserGetOneArgsSchema,
  UserGrossRevenueArgsSchema,
  UserUpdateArgsSchema,
  UserUpdateBalanceArgsSchema,
  UserUpdateSetBlockedArgsSchema,
} from "../schemas/user/user.validator";
import {
  TransactionCreateArgsSchema,
  TransactionGetAllArgsSchema,
  TransactionGetOneArgsSchema,
} from "../schemas/transaction/transaction.validator";
import { hasRole, isAuthenticated, isOwner } from "./rules";
import { WithId } from "../../../../types/utils";
import { TTransaction } from "../../../modules/transaction/transaction.entity";
import { TTransactionGetOneArgs } from "../schemas/transaction/transaction.input";
import { TUserUpdateArgs } from "../schemas/user/user.input";
import {
  ProductCreateArgsSchema,
  ProductGetAllArgsSchema,
  ProductGetOneArgsSchema,
  ProductUpdateArgsSchema,
  ProductUpdateSetBlockedArgsSchema,
} from "../schemas/product/product.validator";
import { TProductUpdateArgs } from "../schemas/product/product.inputs";
import {
  CommentCreateArgsSchema,
  CommentDeleteArgsSchema,
  CommentGetAllArgsSchema,
  CommentGetOneArgsSchema,
} from "../schemas/comment/comment.validator";
import { TCommentDeleteArgs } from "../schemas/comment/comment.inputs";
import {
  RatingCreateArgsSchema,
  RatingGetAllArgsSchema,
  RatingGetOneArgsSchema,
} from "../schemas/rating/rating.validator";
import { TRatingDeleteArgs } from "../schemas/rating/rating.input";
import { AppError } from "../../../common/errors/app.error";
import { HTTPStatuses } from "../../../common/constants/httpStatuses";
import logger from "../../../common/logger";

export const shieldsSchema = shield(
  {
    Query: {
      // Auth
      authMe: isAuthenticated,

      // User
      userGetAll: and(
        inputRule()((_) => UserGetAllArgsSchema),
        isAuthenticated,
        or(hasRole(EUserRole.ADMIN), hasRole(EUserRole.MODERATOR))
      ),
      userGetOne: and(
        inputRule()((_) => UserGetOneArgsSchema),
        isAuthenticated
      ),
      userGetOneByUsername: and(
        inputRule()((_) => UserGetOneByUsernameArgsSchema),
        isAuthenticated
      ),

      // Product
      productGetAll: inputRule()((_) => ProductGetAllArgsSchema),
      productGetOne: inputRule()((_) => ProductGetOneArgsSchema),
      productGetAllCategories: allow,

      // Comment
      commentGetAll: and(
        inputRule()((_) => CommentGetAllArgsSchema),
        isAuthenticated
      ),
      commentGetOne: and(
        inputRule()((_) => CommentGetOneArgsSchema),
        isAuthenticated
      ),

      // Rating
      ratingGetAll: and(
        inputRule()((_) => RatingGetAllArgsSchema),
        isAuthenticated
      ),
      ratingGetOne: and(
        inputRule()((_) => RatingGetOneArgsSchema),
        isAuthenticated
      ),

      // Transaction
      transactionGetAll: and(
        inputRule()((_) => TransactionGetAllArgsSchema),
        isAuthenticated,
        or(hasRole(EUserRole.ADMIN), hasRole(EUserRole.MODERATOR))
      ),
      transactionGetOne: and(
        inputRule()((_) => TransactionGetOneArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TTransactionGetOneArgs>(
            async (authUser, ctx, _parent, args) =>
              await ctx.services.transactionService.isUserOwn(
                authUser.id,
                args.id
              )
          )
        )
      ),
    },
    Mutation: {
      // Auth
      authSignIn: inputRule()((_) => AuthSignInArgsSchema),
      authSignUp: inputRule()((_) => AuthSignUpArgsSchema),

      // User
      userUpdate: and(
        inputRule()((_) => UserUpdateArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TUserUpdateArgs>(
            (authUser, _ctx, _parent, args) => authUser.id === args.id
          )
        )
      ),
      userUpdateBalance: and(
        inputRule()((_) => UserUpdateBalanceArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TUserUpdateArgs>(
            (authUser, _ctx, _parent, args) => authUser.id === args.id
          )
        )
      ),
      userUpdateSetBlocked: and(
        inputRule()((_) => UserUpdateSetBlockedArgsSchema),
        isAuthenticated,
        or(hasRole(EUserRole.ADMIN), hasRole(EUserRole.MODERATOR))
      ),

      // Product
      productCreate: and(
        inputRule()((_) => ProductCreateArgsSchema),
        isAuthenticated
      ),
      productUpdate: and(
        inputRule()((_) => ProductUpdateArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TProductUpdateArgs>(
            async (authUser, ctx, _parent, args) =>
              await ctx.services.productServices.isUserOwn(authUser.id, args.id)
          )
        )
      ),
      productUpdateSetBlocked: and(
        inputRule()((_) => ProductUpdateSetBlockedArgsSchema),
        isAuthenticated,
        or(hasRole(EUserRole.ADMIN), hasRole(EUserRole.MODERATOR))
      ),

      // Comment
      commentCreate: and(
        inputRule()((_) => CommentCreateArgsSchema),
        isAuthenticated
      ),
      commentDelete: and(
        inputRule()((_) => CommentDeleteArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TCommentDeleteArgs>(
            async (authUser, ctx, _parent, args) =>
              await ctx.services.commentServices.isUserOwn(authUser.id, args.id)
          )
        )
      ),

      // Rating

      ratingCreate: and(
        inputRule()((_) => RatingCreateArgsSchema),
        isAuthenticated
      ),
      ratingDelete: and(
        inputRule()((_) => CommentDeleteArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          hasRole(EUserRole.MODERATOR),
          isOwner<any, TRatingDeleteArgs>(
            async (authUser, ctx, _parent, args) =>
              await ctx.services.ratingServices.isUserOwn(authUser.id, args.id)
          )
        )
      ),

      // Transaction
      transactionCreate: and(
        inputRule()((_) => TransactionCreateArgsSchema),
        isAuthenticated
      ),
    },
    Auth: allow,
    User: {
      grossRevenue: and(
        inputRule()((_) => UserGrossRevenueArgsSchema),
        isAuthenticated,
        or(
          hasRole(EUserRole.ADMIN),
          isOwner<WithId<TUser>>(
            (authUser, _ctx, user) => authUser.id === user.id
          )
        )
      ),
    },
    Product: {
      owner: isAuthenticated,
      rating: isAuthenticated,
      comments: isAuthenticated,
    },
    Comment: isAuthenticated,
    Rating: isAuthenticated,
    Transaction: and(
      isAuthenticated,
      or(
        hasRole(EUserRole.ADMIN),
        hasRole(EUserRole.MODERATOR),
        isOwner<WithId<TTransaction>>(
          (authUser, _ctx, transaction) => authUser.id === transaction.ownerId
        )
      )
    ),
  },
  {
    allowExternalErrors: false,
    fallbackError: async (err, _parent, _ctx, _args, _info) => {
      if (err && !(err instanceof AppError)) {
        return new AppError("Internal server error.", {
          status: HTTPStatuses.INTERNAL_SERVER_ERROR,
          originalError: err as Error,
        });
      }

      return new AppError("Unauthorized", {
        status: HTTPStatuses.UNAUTHORIZED,
        originalError: err instanceof Error ? err : undefined,
      });
    },
    fallbackRule: allow, // The default rule for every "rule-undefined" field
  }
);
