import { FastifyPluginCallback } from 'fastify';
import memberController from '../controllers/member';
import withAuthenticateMiddleware from '../middleware/authenticate';

const authRoutes: FastifyPluginCallback = async (fastify, _otps, done) => {
  fastify.addHook('preHandler', withAuthenticateMiddleware);

  fastify.get('/', memberController.getProfile);
  done();
};

export default authRoutes;
