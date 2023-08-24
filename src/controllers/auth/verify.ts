import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../utils/prisma';
import { badRequest, redirect } from '../../utils/response';

export default async (req: FastifyRequest<{
  Params: {
    verifiedToken: string;
  };
}>, res: FastifyReply) => {
  const { verifiedToken } = req.params;

  const activeSession = await prisma.sessions.findFirst({
    where: {
      verifiedToken,
      verified: false,
    },
  });

  if (!activeSession) {
    return badRequest(res, {
      message: 'Invalid link',
    });
  }

  await prisma.sessions.update({
    where: {
      session_id: activeSession.session_id,
    },
    data: {
      verified: true,
    },
  });
  return redirect(res, process.env.FRONTEND_DOMAIN ?? 'http://localhost:5173');
};
