import { FastifyReply, FastifyRequest } from 'fastify';
import auth0 from '../../utils/auth0';
import prisma from '../../utils/prisma';
import { forbidden, success } from '../../utils/response';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const accessToken = req.cookies.access_token ?? '';

  // Get User Data from accessToken
  const userData = auth0.decodeToken(accessToken);

  // Define User source & id
  const source = userData.sub.split('|')[0];
  const userId = userData.sub.split('|')[1];

  // Get User Data from Database
  const user = await prisma.user.findUnique({
    where: {
      auth0_id: userId,
      source: auth0.getSource(source),
    },
  });

  if (!user) {
    return forbidden(res, 'Forbidden');
  }

  return success(res, {
    name: user.name ?? userData.nickname,
    picture: userData.picture ?? undefined,
  });
};
