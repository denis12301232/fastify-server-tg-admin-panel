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
    readonly AWS_BUCKET_NAME: string;
    readonly AWS_BUCKET_REGION: string;
    readonly AWS_ACCESS_KEY_ID: string;
    readonly AWS_SECRET_ACCESS_KEY: string;
    readonly AWS_BUCKET_URL: string;
  }
}
