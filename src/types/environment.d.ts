/* eslint-disable no-unused-vars */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENV: 'development' | 'production';
      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_MANAGEMENT_CLIENT_ID: string;
      AUTH0_MANAGEMENT_CLIENT_SECRET: string;
      AUTH0_CONNECTION: string;
      COOKIE_SECRET: string;
      FRONTEND_DOMAIN: string;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
      SENDGRID_API_KEY: string;
      SENDGRID_FROM_EMAIL: string;
    }
  }
}

export {};
