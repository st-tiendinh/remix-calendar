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
