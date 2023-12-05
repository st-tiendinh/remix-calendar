import { prisma } from '~/server/prisma.server';

export const deleteEventMiddleWare = () => {
  return prisma.$use(async (params, next) => {
    // Check incoming query type
    if (params.model == 'Event' && params.action == 'delete') {
      // Change action to an update
      params.action = 'update';
      // Set field value
      params.args['data'] = { deletedAt: new Date(), deleted: true };
    }

    return next(params);
  });
};
