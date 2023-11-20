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

export const deleteEvent = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!event) return json({ error: 'Can not found event', status: 404 });

  if (event.authorId !== userId)
    return json({ error: 'Not Found', status: 400 });
  // return false;

  const result = await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
  if (!result) {
    return json({ error: 'Delete Event Failed', status: 400 });
    // return false;
  }
  return json({ message: 'Delete Event Success!!', status: 200 });
  // return true;
};

export const getEvents = async () => {
  const event = await prisma.event.findMany();

  if (!event) throw new Response('Something went wrong', { status: 400 });
  console.log(event);
  return json({ event, status: 200 });
};
