import { FastifyPluginCallback } from 'fastify';
import authController from '../controllers/auth';

const authRoutes: FastifyPluginCallback = async (fastify, _otps, done) => {
  fastify.get('/login', authController.login);
  fastify.get('/check', authController.check);
  fastify.get('/callback', authController.callback);
  fastify.get('/logout', authController.logout);
  fastify.post('/resend', authController.resend);
  fastify.get('/verify/:verifiedToken', authController.verify);

  done();
};

export default authRoutes;
