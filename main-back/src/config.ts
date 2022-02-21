import path from "path";

import dotenv from "dotenv";
import {Env} from "utils/env";

dotenv.config({
  path: path.resolve(process.cwd(), "src/apps/main/.env"),
});

export type ConfigEnv = "development" | "production" | "test";
export const ConfigEnv = {
  ofString: (value: string): ConfigEnv => {
    if (value !== "development" && value !== "production" && value !== "test") {
      throw new Error(`Environment can't be ${value}`);
    }

    return value;
  },
};

export type Config = {
  db: {
    connectionString: string;
  };
  environment: ConfigEnv;
  appVersion: string;
  appName: string;
  http: {
    port: number;
    swagger: {
      active: boolean;
    };
  };
  logger: {
    active: boolean;
  };
  jwtToken: {
    secret: string,
  }
};

// ENV const
const getEnvOrThrowLogs = Env.getEnvOrThrow(console.error);

// . CONFIG
export const config: Config = {
  db: {
    connectionString: getEnvOrThrowLogs("MAIN_DB_CONNECTION_STRING"),
  },
  appVersion: getEnvOrThrowLogs("APP_VERSION"),
  appName: "bibus",
  environment: ConfigEnv.ofString(getEnvOrThrowLogs("NODE_ENV")),
  http: {
    port: +getEnvOrThrowLogs("PORT") || 3000,
    swagger: {
      active: true,
    },
  },
  logger: {
    active: true,
  },
  jwtToken: {
    secret: getEnvOrThrowLogs("JWT_TOKEN_SECRET"),
  }
};
