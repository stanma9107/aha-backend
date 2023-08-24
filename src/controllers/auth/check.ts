import { FastifyRequest, FastifyReply } from 'fastify';
import { EventType, UserSource } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  badRequest,
  forbidden,
  success,
  unauthorized,
} from '../../utils/response';
import auth0 from '../../utils/auth0';
import prisma from '../../utils/prisma';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.cookies.access_token;
  const activeSessionId = req.cookies.session_id;

  // Check if token exists
  if (!token) {
    return unauthorized(res, {
      message: 'Unauthorized',
    });
  }

  // Check if token is valid
  const decoded = auth0.validateToken(token);

  if (!decoded.isValid) {
    return forbidden(res, {
      message: 'Forbidden',
    });
  }

  const source = decoded.decoded?.sub.split('|')[0] ?? '';
  const userId = decoded.decoded?.sub.split('|')[1] ?? '';

  // Check if session exists
  if (!activeSessionId) {
    // define user source & id
    const user = await prisma.user.findUnique({
      where: {
        auth0_id: userId,
        source: auth0.getSource(source),
      },
    });

    if (!user) {
      return badRequest(res, {
        message: 'User does not exist',
      });
    }

    // Find Session in database
    const session = await prisma.sessions.findUnique({
      where: {
        session_id: decoded.decoded?.sid,
      },
    });

    if (!session) {
      return unauthorized(res, {
        message: 'Unauthorized (Session Expired)',
      });
    }

    // Create session
    const activeSession = await prisma.activeSessions.create({
      data: {
        user_id: user?.id,
        session_id: session.id,
        active_id: uuidv4(),
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
      sameSite: 'none',
      secure: false,
      httpOnly: true,
      path: '/',
    });

    return success(res, {
      isVerified: session.verified,
    });
  }
  const activeSession = await prisma.activeSessions.findUnique({
    where: {
      active_id: activeSessionId,
      user: {
        auth0_id: userId,
      },
    },
    include: {
      session: true,
      user: true,
    },
  });

  if (!activeSession) {
    return forbidden(res, {
      message: 'Forbidden',
    });
  }

  const canChangePassword = (activeSession.user.source === UserSource.EMAIL);

  return success(res, {
    isVerified: activeSession.session.verified,
    canChangePassword: activeSession.session.verified && canChangePassword,
  });
};
