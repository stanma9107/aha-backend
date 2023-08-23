import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import cookie from '@fastify/cookie';

import { User } from '@prisma/client';
import authRoutes from './routes/auth';
import memberRoutes from './routes/member';

dotenv.config();

declare module 'fastify' {
  interface FastifyRequest {
    user: User,
  }
}

const server = fastify({
  logger: {
    level: 'info',
  },
  disableRequestLogging: true,
});

const port = (process.env.PORT || 8080) as number;

// Setup CORS
server.register(cors, {
  origin: (process.env.ENV === 'development') ? 'http://localhost:5173' : 'https://aha.stanma.dev',
  credentials: true,
});

// Setup Decorators
server.decorateRequest('user', null);

// Setup Routes
server.register(authRoutes, {
  prefix: '/auth',
});
server.register(memberRoutes, {
  prefix: '/member',
});

// Setup cookie
server.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {},
});

// Start Server
server.listen({
  host: '0.0.0.0',
  port,
}, (err, address) => {
  if (err) {
    server.log.error("Couldn't start server");
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
