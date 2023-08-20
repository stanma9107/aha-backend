import { FastifyReply, FastifyRequest } from 'fastify';
import { redirect } from '../../utils/response';

export default (req: FastifyRequest, res: FastifyReply) => {
  const scopes = 'openid profile email offline_access';
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.AUTH0_CLIENT_ID ?? '',
    redirect_uri: (process.env.ENV === 'development') ? `http://localhost:${process.env.PORT}/auth/callback` : 'https://aha-api.stanma.dev/auth/callback',
    scope: scopes,
  });
  const authenticateLink = `https://${process.env.AUTH0_DOMAIN}/authorize?${query.toString()}`;

  return redirect(res, authenticateLink);
};
