import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const server = fastify({
  logger: {
    level: 'info',
  },
  disableRequestLogging: true,
});

const port = (process.env.PORT || 8080) as number;

// Setup CORS
server.register(cors, {
  origin: '*',
});

// Setup Routes
routes.forEach((routePackage) => {
  routePackage.routes.forEach((route) => {
    server.route({
      method: route.method,
      url: `${routePackage.prefix}/${route.path}`,
      handler: route.handler,
    });
  });
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
