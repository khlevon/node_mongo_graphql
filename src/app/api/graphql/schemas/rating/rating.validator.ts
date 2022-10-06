import {
  TRatingCreateArgs,
  TRatingDeleteArgs,
  TRatingGetAllArgs,
  TRatingGetOneArgs,
} from "./rating.input";
import * as yup from "yup";
import { SortOrder } from "mongoose";

export const RatingGetAllArgsSchema: yup.SchemaOf<TRatingGetAllArgs> = yup
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
      productId: yup.string(),
      ownerId: yup.string(),
    }),
  });

export const RatingGetOneArgsSchema: yup.SchemaOf<TRatingGetOneArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });

export const RatingCreateArgsSchema: yup.SchemaOf<TRatingCreateArgs> = yup
  .object()
  .shape({
    input: yup.object().shape({
      score: yup.number().required(),
      productId: yup.string().required(),
    }),
  });

export const RatingDeleteArgsSchema: yup.SchemaOf<TRatingDeleteArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });
