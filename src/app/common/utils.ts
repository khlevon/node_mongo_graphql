import fs from "fs";
import { Types } from "mongoose";
import path from "path";
import { omitBy, isNull } from "lodash";

export const loadSingleSchema = (filePath: string) => {
  return fs.readFileSync(filePath, "utf8");
};

/**
 * Reads all files with `fileExtension` from the given folder and returns them as an mapping of file name to file content
 */
export const loadSchemas = (
  folderPath: string,
  fileExtension: string = ".gql"
): { [key: string]: string } => {
  const files = fs.readdirSync(folderPath);
  const schemas: { [key: string]: string } = {};

  for (const file of files) {
    if (file.endsWith(fileExtension)) {
      const filePath = path.join(folderPath, file);
      const fileContent = loadSingleSchema(filePath);
      const fileName = file.replace(`.${fileExtension}`, "");

      schemas[fileName] = fileContent;
    }
  }

  return schemas;
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Convert string to mongodb ObjectId
export const toObjectId = (id: string) => new Types.ObjectId(id.toString());

// Export and clean connection metadata from args
type TGetConnectionMetadataReturn<TFilter, TSorderByField> = {
  pagination: { offset: number; limit: number };
  orderBy: { field: TSorderByField; direction: "asc" | "desc" };
  filter: TFilter;
};

export const getConnectionMetadata = <TFilter = any, TSorderByField = string>(
  args: any
): TGetConnectionMetadataReturn<TFilter, TSorderByField> => {
  const { pagination = {}, orderBy = {}, filter } = omitBy(args, isNull);
  const { offset = 0, limit = 100 } = omitBy(pagination, isNull);
  const { field = "createdAt", direction = "DESC" } = omitBy(orderBy, isNull);

  return {
    pagination: { offset, limit },
    orderBy: { field, direction },
    filter,
  };
};
