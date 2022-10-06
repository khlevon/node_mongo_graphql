import { TOrderBy, TPagination } from "../../../../../types/app";

export type TCommentGetAllFilter = {
  productId?: string;
  ownerId?: string;
  replyToId?: string;
};

export type TCommentGetAllArgs = {
  pagination?: TPagination;
  orderBy?: TOrderBy;
  filter?: TCommentGetAllFilter;
};

export type TCommentGetOneArgs = {
  id: string;
};

export type TCommentCreateInput = {
  body: string;
  productId: string;
  replyToId?: string;
};

export type TCommentCreateArgs = {
  input: TCommentCreateInput;
};

export type TCommentDeleteArgs = {
  id: string;
};
