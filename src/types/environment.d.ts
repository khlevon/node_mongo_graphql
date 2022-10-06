export interface ProcessEnv {
  // [key: string]: any;
  NODE_ENV: string; // "development" | "production" | "test" | "staging"
  LOG_LEVEL: string;

  MONGO_DB_HOST?: string;
  MONGO_DB_PORT?: number;
  MONGO_DB_NAME?: string;
  MONGO_DB_USERNAME?: string;
  MONGO_DB_PASSWORD?: string;

  APP_HOST?: string;
  APP_PORT?: number;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
}
