import BaseError from "../base/error";
import { HTTPStatuses } from "../constants/httpStatuses";

export type TAppErrorData = {
  status: HTTPStatuses;
  data?: any;
  code?: string;
  originalError?: Error | undefined;
};

class AppError extends BaseError {
  public data: any;
  public status: HTTPStatuses;
  public code?: string;

  constructor(
    message: string,
    {
      status,
      data = {},
      code = undefined,
      originalError = undefined,
    }: TAppErrorData
  ) {
    super(message, originalError);
    this.data = data;
    this.status = status;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON = () => {
    const data = super.toJSON();

    return {
      ...data,
      data: this.data,
      status: this.status,
      code: this.code,
      stack: this.stack,
    };
  };
}

export { AppError };
