import {
  TCommentCreateArgs,
  TCommentDeleteArgs,
  TCommentGetAllArgs,
  TCommentGetOneArgs,
} from "./comment.inputs";
import * as yup from "yup";
import { SortOrder } from "mongoose";

export const CommentGetAllArgsSchema: yup.SchemaOf<TCommentGetAllArgs> = yup
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
      replyToId: yup.string(),
    }),
  });

export const CommentGetOneArgsSchema: yup.SchemaOf<TCommentGetOneArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });

export const CommentCreateArgsSchema: yup.SchemaOf<TCommentCreateArgs> = yup
  .object()
  .shape({
    input: yup.object().shape({
      body: yup.string().max(255).required(),
      productId: yup.string().required(),
      replyToId: yup.string(),
    }),
  });

export const CommentDeleteArgsSchema: yup.SchemaOf<TCommentDeleteArgs> = yup
  .object()
  .shape({
    id: yup.string().required(),
  });
