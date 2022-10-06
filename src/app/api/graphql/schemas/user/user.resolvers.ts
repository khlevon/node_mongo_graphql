import { IResolvers } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";

import { Resolvers as QueryResolvers } from "./user.query.resolvers";
import { Resolvers as MutationResolvers } from "./user.mutation.resolvers";
import deepmerge from "deepmerge";

export const Resolvers = deepmerge.all<IResolvers<any, TContext>>([
  QueryResolvers,
  MutationResolvers,
]);
