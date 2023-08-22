import { FastifyReply, FastifyRequest } from 'fastify';
import auth0 from '../utils/auth0';
import prisma from '../utils/prisma';
import {
  unauthorized,
  forbidden,
} from '../utils/response';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const accessToken = req.cookies.access_token;
  const activeSessionId = req.cookies.session_id;

  // check if access_token and session_id exist
  if (!accessToken || !activeSessionId) {
    return unauthorized(res, 'Unauthorized');
  }

  // validate access_token from auth0 utils
  const checkToken = auth0.validateToken(accessToken);
  if (!checkToken.isValid) {
    return unauthorized(res, 'Unauthorized');
  }

  // validate session_id from prisma
  const activeSession = await prisma.activeSessions.findUnique({
    where: {
      active_id: activeSessionId,
    },
  });
  if (!activeSession) {
    return forbidden(res, 'Forbidden');
  }

  return true;
};
