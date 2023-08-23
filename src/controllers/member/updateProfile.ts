import { FastifyReply, FastifyRequest } from 'fastify';
import { success } from '../../utils/response';
import prisma from '../../utils/prisma';

export default async (req: FastifyRequest<{
  Body: {
    name: string;
  };
}>, res: FastifyReply) => {
  const { user } = req;
  const { name } = req.body;

  // Update User Name
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
    },
  });

  return success(res, 'Profile Updated.');
};
