import { json, redirect } from '@remix-run/node';
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

  return redirect('/events?success=Create Event Success!!');
};

export const deleteEvent = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) return json({ error: 'Can not found event', status: 404 });

  if (event.authorId !== userId) {
    return redirect(
      `/events/${eventId}/edit?error=You are not authorized to delete this event`
    );
  } else {
    const result = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    if (!result) {
      return json({ error: 'Delete Event Failed', status: 400 });
    }
    return redirect('/events?success=Deleted Event Success!!');
  }
};

export const getEvents = async () => {
  const event = await prisma.event.findMany();

  if (!event) throw new Response('Something went wrong', { status: 400 });

  return event;
};
