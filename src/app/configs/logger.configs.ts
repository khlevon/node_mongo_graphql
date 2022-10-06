import winston, { format } from "winston";
import configs from "./app.configs";

const prodTransports = [];

const devTransports = [
  new winston.transports.Console({
    format: format.combine(
      format.prettyPrint({
        depth: 4,
      })
    ),
    level: configs.get("LOG_LEVEL"),
  }),
];

const options: winston.LoggerOptions = {
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: configs.get("IS_PROD") ? prodTransports : devTransports,
};

export default options;
