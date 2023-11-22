import { json } from '@remix-run/node';
import { prisma } from './prisma.server';
import type { EventData } from '~/shared/utils/types.server';

export const updateEvent = async (eventData: EventData, id: string) => {
  const event = await prisma.event.update({
    where: { id },
    data: eventData,
  });
  if (!event) return json({ error: 'Can not update event', status: 400 });
  return json({
    message: 'Event updated successfully',
    status: 200,
  });
};

export const createEvent = async (eventData: EventData) => {
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

  const result = await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
  if (!result) {
    return json({ error: 'Delete Event Failed', status: 400 });
  }
  return json({ message: 'Delete Event Success!!', status: 200 });
};

export const getEvents = async () => {
  const events = await prisma.event.findMany();

  if (!events) throw new Response('Something went wrong', { status: 400 });

  return json({ events, status: 200 });
};

export const getEventsByDay = async (date: string) => {
  let targetDate = new Date(date);

  const startDate = new Date(
    targetDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
  );
  const endDate = new Date(
    targetDate.toISOString().split('T')[0] + 'T23:59:59.999Z'
  );

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return json({ events, status: 200 });
};
