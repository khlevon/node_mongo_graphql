import { gql } from "apollo-server";
import { IResolvers } from "@graphql-tools/utils";
import { DateTimeResolver } from "graphql-scalars";
import { DocumentNode } from "graphql";
import { TContext } from "../../../../types/graphql";
// Import modules
import * as auth from "./auth";
import * as user from "./user";
import * as product from "./product";
import * as comment from "./comment";
import * as rating from "./rating";
import * as transaction from "./transaction";
import { loadSingleSchema } from "../../../common/utils";
import path from "path";

export const Types: DocumentNode = gql`
  ${loadSingleSchema(path.join(__dirname, "schema.gql"))}
`;

export const typeDefs: DocumentNode[] = [
  Types,
  auth.Types,
  user.Types,
  product.Types,
  comment.Types,
  rating.Types,
  transaction.Types,
];

export const resolvers: IResolvers<any, TContext>[] = [
  { DateTime: DateTimeResolver },
  auth.Resolvers,
  user.Resolvers,
  product.Resolvers,
  comment.Resolvers,
  rating.Resolvers,
  transaction.Resolvers,
];
