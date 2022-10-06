import appConfigs from "../../configs/app.configs";
import { HTTPStatuses } from "../constants/httpStatuses";
import { AppError } from "./app.error";

const [IS_PROD] = appConfigs.get(["IS_PROD"]);

export const processError = (error: any) => {
  if (!(error instanceof AppError)) {
    error = new AppError("Internal server error", {
      status: HTTPStatuses.INTERNAL_SERVER_ERROR,
      originalError: error,
    });
  }

  const { status, code, message, data, stack } = error.toJSON();

  return {
    status,
    code,
    message,
    data,
    stack: IS_PROD ? undefined : stack,
  };
};
