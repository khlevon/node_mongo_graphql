import { Connection } from "mongoose";
import { MongoServerError } from "mongodb";
import { parse } from "date-fns";
import { fetchNextChunk } from "./api";
import logger from "../../common/logger";
import { EUserGender, EUserRole, TUser } from "../../modules/user/user.entity";
import { randomBytes, scryptSync } from "crypto";

const generateRandomToken = (byteLength = 32) => {
  const buffer = randomBytes(byteLength);

  return buffer.toString("hex");
};

const hashWithSalt = (source: string, salt = generateRandomToken(8)) => {
  const sourceHash = scryptSync(source, salt, 64);

  return {
    hash: sourceHash.toString("hex"),
    salt,
  };
};

export default async function start(db: Connection) {
  const collection = db.collection<TUser>("users");
  try {
    await collection.drop();
  } catch (e) {
    if (!(e instanceof MongoServerError && e.code === 26)) {
      logger.debug(e);
    }
  }

  // Add system users
  const password = "Password123";
  const { hash, salt } = hashWithSalt(password);

  const adminUser: TUser & { createdAt: Date; updatedAt: Date } = {
    firstName: "Admin",
    lastName: "Admin",
    middleName: "",
    gender: EUserGender.OTHER,
    email: "admin@system.com",
    username: "admin",
    image: "",
    userAgent: "",
    birthDate: new Date(),
    balance: 10000,
    role: EUserRole.ADMIN,
    isBlocked: false,
    passwordSalt: salt,
    password: hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const moderatorUser: TUser & { createdAt: Date; updatedAt: Date } = {
    firstName: "Moderator",
    lastName: "Moderator",
    middleName: "",
    gender: EUserGender.OTHER,
    email: "moderator@system.com",
    username: "moderator",
    image: "",
    userAgent: "",
    birthDate: new Date(),
    balance: 5000,
    role: EUserRole.MODERATOR,
    isBlocked: false,
    passwordSalt: salt,
    password: hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collection.insertMany([adminUser, moderatorUser]);

  let idMapping = {};

  let skip = 0;
  const limit = 100;
  while (true) {
    const { users } = await fetchNextChunk("users", skip, limit);

    if (!users.length) {
      break;
    }

    const idMappingEntries: [any, any][] = [];

    const res = await collection.insertMany(
      users.map((user: any) => {
        const {
          id,
          firstName,
          lastName,
          middleName,
          gender,
          email,
          username,
          image,
          userAgent,
          birthDate,
        } = user;

        const password = "Password123";
        const { hash, salt } = hashWithSalt(password);

        idMappingEntries.push([id, undefined]);

        return {
          firstName,
          lastName,
          middleName,
          gender: (gender || "other").toUpperCase(),
          email,
          username,
          image,
          userAgent,
          birthDate: parse(birthDate, "yyyy-MM-dd", new Date()),
          balance: 1000,
          role: "USER",
          isBlocked: false,
          passwordSalt: salt,
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    Object.keys(res.insertedIds).forEach((index) => {
      idMappingEntries[index][1] = res.insertedIds[index].toString();
    });

    idMapping = {
      ...idMapping,
      ...Object.fromEntries(idMappingEntries),
    };

    skip += limit;
  }

  return idMapping;
}
