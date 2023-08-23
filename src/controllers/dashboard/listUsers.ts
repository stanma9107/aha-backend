import { FastifyReply, FastifyRequest } from 'fastify';
import { EventType } from '@prisma/client';
import prisma from '../../utils/prisma';
import { success } from '../../utils/response';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const users = await prisma.user.findMany({
    include: {
      events: {
        where: {
          event_type: EventType.LOGIN,
        },
      },
      activeSessions: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  return success(res, users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    source: user.source,
    created_at: user.createdAt,
    login_count: user.events.length,
    last_login: user.activeSessions[0]?.createdAt ?? null,
  })));
};
