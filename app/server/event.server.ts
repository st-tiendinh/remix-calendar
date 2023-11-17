import { json } from '@remix-run/node';
import { prisma } from './prisma.server';
import type { Event } from '~/shared/utils/types.server';

export const createEvent = async (eventData: Event) => {
  const event = await prisma.event.create({
    data: eventData,
  });

  if (!event) return json({ message: 'Something went wrong', status: 400 });

  return json({ message: 'Create Event Success!!', status: 200 });
};
