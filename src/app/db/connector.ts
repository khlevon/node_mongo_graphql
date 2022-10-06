import mongoose from "mongoose";
import configs from "../configs/app.configs";

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

mongoose.set("toObject", {
  virtuals: true,
  versionKey: true,
});

const [dbHost, dbPort, dbUser, dbPassword, dbName] = configs.get([
  "MONGO_DB_HOST",
  "MONGO_DB_PORT",
  "MONGO_DB_USERNAME",
  "MONGO_DB_PASSWORD",
  "MONGO_DB_NAME",
]);

const connection = mongoose.connect(
  `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
);

export default connection;
