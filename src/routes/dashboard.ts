import { FastifyPluginCallback } from 'fastify';
import usersController from '../controllers/dashboard';
import withAuthenticateMiddleware from '../middleware/authenticate';

const dashboardRoutes: FastifyPluginCallback = async (fastify, _opts, done) => {
  fastify.addHook('preHandler', withAuthenticateMiddleware);

  fastify.get('/users', usersController.listUsers);
  done();
};

export default dashboardRoutes;
