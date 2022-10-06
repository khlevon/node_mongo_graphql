import {
  TProductCreateArgs,
  TProductGetAllArgs,
  TProductGetOneArgs,
  TProductUpdateArgs,
  TProductUpdateSetBlockedArgs,
} from "./product.inputs";
import * as yup from "yup";
import { SortOrder } from "mongoose";

export const ProductGetAllArgsSchema: yup.SchemaOf<TProductGetAllArgs> = yup
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
      category: yup.string(),
    }),
  });

export const ProductGetOneArgsSchema: yup.SchemaOf<TProductGetOneArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });

export const ProductCreateArgsSchema: yup.SchemaOf<TProductCreateArgs> = yup
  .object()
  .shape({
    input: yup
      .object()
      .shape({
        title: yup.string().required(),
        description: yup.string(),
        price: yup.number().positive().required(),
        discountPercentage: yup.number().min(0).max(100),
        stock: yup.number().required(),
        brand: yup.string().required(),
        category: yup.string().required(),
        thumbnail: yup.string(),
        images: yup.array().of(yup.string().required()).required(),
      })
      .required(),
  });

export const ProductUpdateArgsSchema: yup.SchemaOf<TProductUpdateArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
    input: yup
      .object()
      .shape({
        description: yup.string(),
        price: yup.number().positive(),
        discountPercentage: yup.number().min(0).max(100),
        stock: yup.number(),
        thumbnail: yup.string(),
        images: yup.array().of(yup.string().required()),
      })
      .required(),
  });

export const ProductUpdateSetBlockedArgsSchema: yup.SchemaOf<TProductUpdateSetBlockedArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
    isBlocked: yup.boolean().required(),
  });
