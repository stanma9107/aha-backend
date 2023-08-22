import { FastifyReply, FastifyRequest } from 'fastify';
import { redirect } from '../../utils/response';

export default (req: FastifyRequest, res: FastifyReply) => {
  // Remove cookies
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('session_id');

  // Generate Auth0 logout link
  const query = new URLSearchParams({
    client_id: process.env.AUTH0_CLIENT_ID ?? '',
    returnTo: process.env.FRONTEND_DOMAIN ?? 'http://localhost:5173',
  });
  const logoutLink = `https://${process.env.AUTH0_DOMAIN}/v2/logout?${query.toString()}`;

  return redirect(res, logoutLink);
};
