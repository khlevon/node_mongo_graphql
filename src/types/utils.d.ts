import { Types } from "mongoose";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type WithId<T> = T & { id: string };
