import { TOrderBy, TPagination } from "../../../../../types/app";

export type TTransactionGetAllFilter = {
  ownerId?: string;
};

export type TTransactionGetAllArgs = {
  pagination?: TPagination;
  orderBy?: TOrderBy;
  filter?: TTransactionGetAllFilter;
};

export type TTransactionGetOneArgs = {
  id: string;
};

export type TTransactionCreateInputProduct = {
  productId: string;
  quantity: number;
};

export type TTransactionCreateInput = {
  products: TTransactionCreateInputProduct[];
};

export type TTransactionCreateArgs = {
  input: TTransactionCreateInput;
};
