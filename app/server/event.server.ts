import { json } from '@remix-run/node';
import { prisma } from './prisma.server';
import type { Event } from '~/shared/utils/types.server';

export const createEvent = async (eventData: Event) => {
  const event = await prisma.event.create({
    data: eventData,
  });

  if (!event) return json({ error: 'Something went wrong', status: 400 });

  return json({ message: 'Create Event Success!!', status: 200 });
};

export const getEvents = async () => {
  const event = await prisma.event.findMany();

  if (!event) throw new Response('Something went wrong', { status: 400 });
console.log(event)
  return json({ event, status: 200 });
};
