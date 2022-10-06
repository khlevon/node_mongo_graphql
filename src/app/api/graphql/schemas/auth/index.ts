import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import { loadSchemas } from "../../../../common/utils";

export const Types: DocumentNode = gql`
  ${Object.values(loadSchemas(__dirname)).join("\n")}
`;

export { Resolvers } from "./auth.resolvers";
