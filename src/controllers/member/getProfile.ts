import { FastifyReply, FastifyRequest } from 'fastify';
import auth0 from '../../utils/auth0';
import { success } from '../../utils/response';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const { user } = req;
  const accessToken = req.cookies.access_token ?? '';

  // Get User Data from accessToken
  const userData = auth0.decodeToken(accessToken);

  return success(res, {
    name: user.name ?? userData.nickname,
    picture: userData.picture ?? undefined,
  });
};
