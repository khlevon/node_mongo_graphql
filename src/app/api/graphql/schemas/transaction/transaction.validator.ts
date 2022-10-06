import {
  TTransactionCreateArgs,
  TTransactionGetAllArgs,
  TTransactionGetOneArgs,
} from "./transaction.input";
import * as yup from "yup";
import { SortOrder } from "mongoose";

export const TransactionGetAllArgsSchema: yup.SchemaOf<TTransactionGetAllArgs> = yup
  .object()
  .shape({
    pagination: yup.object().shape({
      offset: yup.number().min(0).default(0),
      limit: yup.number().min(1).default(100),
    }),
    orderBy: yup.object().shape({
      field: yup.string().oneOf(["createdAt"]).default("createdAt"),
      direction: yup.mixed<SortOrder>().oneOf(["asc", "desc"]).default("desc"),
    }),
    filter: yup.object().shape({
      ownerId: yup.string(),
    }),
  });

export const TransactionGetOneArgsSchema: yup.SchemaOf<TTransactionGetOneArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });

export const TransactionCreateArgsSchema: yup.SchemaOf<TTransactionCreateArgs> = yup
  .object()
  .shape({
    input: yup.object().shape({
      products: yup.array().of(
        yup.object().shape({
          productId: yup.string().required(),
          quantity: yup.number().min(1).required(),
        })
      ),
    }),
  });
