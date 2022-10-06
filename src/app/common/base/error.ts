if (!("toJSON" in Error.prototype))
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach((key) => {
        alt[key] = this[key];
      });

      return alt;
    },
    configurable: true,
    writable: true,
  });

abstract class BaseError extends Error {
  public message: string;
  public originalError: Error | undefined;
  constructor(message: string, originalError: Error | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.originalError = originalError;

    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON = () => {
    const data = super.toJSON();

    return {
      ...data,
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  };
}

export default BaseError;
