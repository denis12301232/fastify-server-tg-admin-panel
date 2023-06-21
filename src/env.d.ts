declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: number;
    readonly HOST: string;
    readonly CLIENT_DOMAIN: string;
    readonly MONGO_URL: string;
    readonly MONGO_NAME: string;
    readonly REDIS_URL: string;
    readonly GOOGLE_USER: string;
    readonly GOOGLE_APP_PASS: string;
    readonly JWT_ACCESS_SECRET: string;
    readonly JWT_REFRESH_SECRET: string;
  }
}
