import { FastifyReply, FastifyRequest } from 'fastify';
import { redirect } from '../../utils/response';
import auth0 from '../../utils/auth0';

interface IQueryString {
  code: string;
  state: string;
}

export default async (req: FastifyRequest<{
  Querystring: IQueryString;
}>, res: FastifyReply) => {
  const token = await auth0.getToken(req.query.code);
  if (token.isValid) {
    // Set cookie for access_token
    res.setCookie('access_token', token.idToken, {
      sameSite: true,
      httpOnly: true,
      secure: process.env.ENV !== 'development',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    // Set cookie for refresh_token
    res.setCookie('refresh_token', token.refreshToken, {
      sameSite: true,
      httpOnly: true,
      secure: process.env.ENV !== 'development',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }
  return redirect(res, process.env.FRONTEND_DOMAIN ?? 'http://localhost:5173');
};
