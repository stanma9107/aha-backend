/* eslint-disable no-unused-vars */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENV: 'development' | 'production';
      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      COOKIE_SECRET: string;
      FRONTEND_DOMAIN: string;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
    }
  }
}

export {};
