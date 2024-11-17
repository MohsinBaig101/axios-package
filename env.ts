// import * as dotenv from "dotenv";
// import * as path from "path";
import { getOsEnv, getOsEnvNumber, getOsPaths, getOsEnvBoolean, getOsEnvArray } from "./src/lib/env";

// enum APP_ENV {
//   LOCAL = "local",
//   DEV = "dev",
//   SIT = "sit",
//   UAT = "uat",
//   PROD = "prod",
//   DR = "dr",
// }
// const envFile = getEnvFile<object>(process.env.APP_ENV, APP_ENV);
// dotenv.config({ path: path.join(process.cwd(), envFile) });
export const env = {
  APP_PORT: getOsEnv("APP_PORT"),
  isProduction: getOsEnvBoolean("IS_PRODUCTION"),
  log: {
    debugMode: getOsEnv('APP_DEBUG') || true,
  },
  app: {
    dirs: {
      uploads: getOsEnv("FILE_UPLOAD_PATH"),
      controllers: getOsPaths("CONTROLLERS"),
      entities: getOsPaths("TYPEORM_ENTITIES"),
    },
    prefix: getOsEnv("APP_PREFIX_ROUTE"),
  },
  config: {
    maxContentLength: getOsEnvNumber("MAX_CONTENT_LENGTH"),
    maxBodyLength: getOsEnvNumber("MAX_BODY_LENGTH"),
    timeout: getOsEnvNumber("REQUEST_TIMEOUT"),
    timeoutErrorMessage: getOsEnv("TIMEOUT_ERROR_MESSAGE"),
    retries: getOsEnvNumber("REQUEST_RETRIES") || 3,
    retryDelay: getOsEnvNumber("REQUEST_RETRY_DELAY"),
    retriesStatuses: getOsEnvArray("REQUEST_RETRIES_STATUSES"),
  },
  constants: {
    enableCurl: getOsEnvBoolean("ENABLE_CURL") || false,
    inlineCurl: getOsEnvBoolean("INLINE_CURL") || false,
    enableApiInterceptorLog: getOsEnvBoolean("ENABLE_INTERCEPTOR_LOG") || false,

  }
};
