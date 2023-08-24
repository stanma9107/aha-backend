import { FastifyReply, FastifyRequest } from 'fastify';
import {
  badRequest,
  forbidden,
  internalServerError,
  success,
  unauthorized,
} from '../../utils/response';
import auth0 from '../../utils/auth0';
import prisma from '../../utils/prisma';
import sendgrid from '../../utils/sendgrid';

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

  // Check if session exists
  if (!activeSessionId) {
    return unauthorized(res, {
      message: 'Unauthorized',
    });
  }

  // Check if session is valid
  const activeSession = await prisma.activeSessions.findUnique({
    where: {
      active_id: activeSessionId,
    },
    include: {
      user: true,
      session: true,
    },
  });

  if (!activeSession) {
    return unauthorized(res, {
      message: 'Unauthorized',
    });
  }

  // Check session & user's session is the same
  if (activeSession.session.session_id !== decoded.decoded?.sid) {
    return badRequest(res, {
      message: 'Session does not match',
    });
  }

  // start resend email logic
  const { user, session } = activeSession;
  if (session.verified || !user.email) {
    return badRequest(res, {
      message: 'Session already verified or user does not have an email',
    });
  }
  const sendEmail = await sendgrid.sendEmail(
    user.email,
    'Verify your session',
    `Click this link to verify your session: ${process.env.ENV === 'development' ? 'http://localhost:3000' : 'https://aha-api.stanma.dev'}/auth/verify/${session.verifiedToken}`,
  );
  if (!sendEmail.sent) {
    return internalServerError(res, 'Failed to send email');
  }
  return success(res, 'Email sent.');
};
