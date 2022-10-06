import { IResolvers } from "@graphql-tools/utils";
import { TContext } from "../../../../../types/graphql";

import { Resolvers as QueryResolvers } from "./auth.query.resolvers";
import { Resolvers as MutationResolvers } from "./auth.mutation.resolvers";
import deepmerge from "deepmerge";

export const Resolvers = deepmerge.all<IResolvers<any, TContext>>([
  QueryResolvers,
  MutationResolvers,
]);
