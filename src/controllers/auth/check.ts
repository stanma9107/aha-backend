import { FastifyRequest, FastifyReply } from 'fastify';
import { forbidden, success, unauthorized } from '../../utils/response';
import auth0 from '../../utils/auth0';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.cookies.access_token;

  // Check if token exists
  if (!token) {
    return unauthorized(res, {
      message: 'Unauthorized',
    });
  }

  // Check if token is valid
  const decoded = auth0.validateToken(token);

  if (!decoded) {
    return forbidden(res, {
      message: 'Forbidden',
    });
  }
  return success(res, {
    message: 'Valid token',
  });
};
