import { TOrderBy, TPagination } from "../../../../../types/app";

export type TRatingGetAllFilter = {
  productId?: string;
  ownerId?: string;
};

export type TRatingGetAllArgs = {
  pagination?: TPagination;
  orderBy?: TOrderBy;
  filter?: TRatingGetAllFilter;
};

export type TRatingGetOneArgs = {
  id: string;
};

export type TRatingCreateInput = {
  score: number;
  productId: string;
};

export type TRatingCreateArgs = {
  input: TRatingCreateInput;
};

export type TRatingDeleteArgs = {
  id: string;
};
