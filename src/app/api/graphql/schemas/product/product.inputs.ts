import { TOrderBy, TPagination } from "../../../../../types/app";

export type TProductGetAllFilter = {
  category?: string;
};

export type TProductGetAllArgs = {
  pagination?: TPagination;
  orderBy?: TOrderBy;
  filter?: TProductGetAllFilter;
};

export type TProductCreateInput = {
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images: string[];
};

export type TProductUpdateInput = {
  description?: string;
  price?: number;
  discountPercentage?: number;
  stock?: number;
  thumbnail?: string;
  images?: string[];
};

export type TProductGetOneArgs = {
  id: string;
};

export type TProductCreateArgs = {
  input: TProductCreateInput;
};

export type TProductUpdateArgs = {
  id: string;
  input: TProductUpdateInput;
};

export type TProductUpdateSetBlockedArgs = {
  id: string;
  isBlocked: boolean;
};
