import { SortOrder, Types } from "mongoose";
import { ExpressContext } from "apollo-server-express";
import { TAppContext } from "./app";


export type TPageInfo = {
  offset: number;
  limit: number;
  hasNextPage: boolean;
};

export type TNode<T = any> = T & {
  id: Types.ObjectId;
};

export type TEdge<T = any> = {
  // cursor: string;
  node: TNode<T>;
};

export type TConnection<T = any> = {
  count: number;
  pageInfo: TPageInfo;
  edges: TEdge<T>[];
};

export type TContext = ExpressContext & TAppContext;
