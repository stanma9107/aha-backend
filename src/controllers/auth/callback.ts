import { FastifyReply, FastifyRequest } from 'fastify';
import { EventType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from '../../utils/response';
import auth0 from '../../utils/auth0';
import prisma from '../../utils/prisma';

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

    // Get user data & check if user exists in database
    const userData = auth0.decodeToken(token.idToken);
    const source = userData.sub.split('|')[0] ?? '';
    const userId = userData.sub.split('|')[1] ?? '';
    const userExists = await prisma.user.findUnique({
      where: {
        auth0_id: userId,
        source: auth0.getSource(source),
      },
    });

    // Create user if user does not exist
    const user = (userExists) || await prisma.user.create({
      data: {
        auth0_id: userId,
        source: auth0.getSource(source),
        email: userData.email,
      },
    });

    // Create event history for registration
    await prisma.eventHistory.create({
      data: {
        event_type: (userExists) ? EventType.LOGIN : EventType.SIGNUP,
        user_id: user.id,
      },
    });

    // Find existing session
    const sessionExists = await prisma.sessions.findUnique({
      where: {
        user_id: user.id,
        session_id: userData.sid,
      },
    });

    // Create session
    const session = (sessionExists) || await prisma.sessions.create({
      data: {
        user_id: user.id,
        session_id: userData.sid,
        verified: (user.source !== 'EMAIL'),
      },
    });

    // Create active session
    const activeSession = await prisma.activeSessions.create({
      data: {
        active_id: uuidv4(),
        user_id: user.id,
        session_id: session.id,
      },
    });

    // Create event history for create active session
    await prisma.eventHistory.create({
      data: {
        event_type: EventType.CREATE_SESSION,
        user_id: user.id,
        active_session_id: activeSession.id,
      },
    });

    // Store session id in cookie
    res.setCookie('session_id', activeSession.active_id, {
      sameSite: true,
      httpOnly: true,
      secure: process.env.ENV !== 'development',
      path: '/',
    });
  }
  return redirect(res, process.env.FRONTEND_DOMAIN ?? 'http://localhost:5173');
};
