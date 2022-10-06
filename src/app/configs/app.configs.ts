import { ProcessEnv } from "../../types/environment";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const NODE_ENV = process.env.NODE_ENV || "development";

const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);

if (fs.existsSync(envPath)) {
  dotenv.config({
    path: envPath,
  });
}

// set default values
const ENV: ProcessEnv & {
  IS_PROD: boolean;
  IS_DEV: boolean;
  IS_TEST: boolean;
  IS_STAGING: boolean;
} = {
  NODE_ENV,
  LOG_LEVEL: "debug",
  IS_PROD: NODE_ENV === "production",
  IS_DEV: NODE_ENV === "development",
  IS_STAGING: NODE_ENV === "staging",
  IS_TEST: NODE_ENV === "test",
  APP_HOST: "localhost",
  APP_PORT: 3000,
  JWT_SECRET: "secret",
  JWT_EXPIRES_IN: "1d",
  ...process.env,
};

// Base abstract class for all configs
abstract class BaseConfigs {
  protected abstract secrets: typeof ENV;

  public get(key: keyof typeof ENV | (keyof typeof ENV)[]): any {
    if (Array.isArray(key)) {
      return key.map((k) => this.get(k));
    }

    return this.secrets[key];
  }

  public all(): any {
    return this.secrets;
  }
}

// Production configs
class ProdConfigs extends BaseConfigs {
  protected secrets = ENV;
}

// Development configs
class DevConfigs extends BaseConfigs {
  protected secrets = {
    ...ENV,
  };
}

// Create configs singleton instance based on NODE_ENV
let appConfigs: BaseConfigs;

switch (NODE_ENV) {
  case "production":
    appConfigs = new ProdConfigs();
    break;
  default:
    appConfigs = new DevConfigs();
    break;
}

// Export configs instance as default
export default appConfigs;
