import winston, { Logger } from "winston";
import loggerConfig from "../configs/logger.configs";

const logger: Logger = winston.createLogger(loggerConfig);

export default logger;
