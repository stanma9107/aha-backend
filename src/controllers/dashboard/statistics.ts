import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../utils/prisma';
import { success } from '../../utils/response';

export default async (req: FastifyRequest, res: FastifyReply) => {
  const signUpCount = await prisma.user.count();
  const todayActiveSessionToday = await prisma.activeSessions.groupBy({
    by: ['user_id'],
    _count: {
      _all: true,
    },
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });
  const totalActiveSessionTodaySum = todayActiveSessionToday.reduce(
    // eslint-disable-next-line no-underscore-dangle
    (acc, cur) => acc + cur._count._all,
    0,
  );

  const lastSevenDaysActiveSessionRolling = await prisma.activeSessions.groupBy({
    by: ['user_id'],
    _count: {
      _all: true,
    },
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
  });

  const totalActiveSessionLastSevenDaysSum = lastSevenDaysActiveSessionRolling.reduce(
    // eslint-disable-next-line no-underscore-dangle
    (acc, cur) => acc + cur._count._all,
    0,
  );

  return success(res, {
    signUpCount,
    todayActiveSession: totalActiveSessionTodaySum,
    avarageLastSevenDaysActiveSessionRolling: totalActiveSessionLastSevenDaysSum / 7,
  });
};
