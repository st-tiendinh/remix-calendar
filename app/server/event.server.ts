import { json } from '@remix-run/node';
import { prisma } from './prisma.server';

export const createEvent = async (event: any) => {
  try {
    await prisma.event.create({
      data: event,
    });
    return json({ message: 'Create Event Success!!', status: 200 });
  } catch (error) {
    return json({ error, status: 400 });
  }
};

export const deleteEvent = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!event) return json({ error: 'Can not found event', status: 404 });

  if (event.authorId !== userId)
    // throw new Response('Not Found', { status: 400 });
    return false;

  const result = await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
  if (!result) {
    // return json({ error: 'Delete Event Failed', status: 400 });
    return false;
  }
  // return json({ message: 'Delete Event Success!!', status: 200 });
  return true;
};
