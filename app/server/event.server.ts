import { json, redirect } from '@remix-run/node';
import { prisma } from './prisma.server';
import type { EventData } from '~/shared/utils/types.server';
import { deleteEventMiddleWare } from '~/shared/middleware/softDeleteEvent';
import { mailSender } from '~/shared/utils/mailSender';

export const updateEvent = async (eventData: EventData, id: string) => {
  const event = await prisma.event.update({
    where: { id },
    data: eventData,
  });

  if (!event) return json({ error: 'Can not update event', status: 400 });

  return redirect('/events?success=Update Event Success!!');
};

export const createEvent = async (eventData: EventData) => {
  const baseUrl = process.env.BASE_URL;

  const guestMail = eventData.guests?.map((guest: any) => guest.email);

  const event = await prisma.event.create({
    data: eventData,
  });

  if (!event) return json({ error: 'Something went wrong', status: 400 });

  if (guestMail && event) {
    mailSender({
      usersEmail: guestMail,
      eventLink: `${baseUrl}/events/${event.id}`,
    });
  }

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
      `/events/${eventId}?error=You are not authorized to delete this event`
    );
  } else {
    deleteEventMiddleWare();
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

export const restoreEvent = async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) return json({ error: 'Can not found event', status: 404 });

  if (event.authorId !== userId) {
    return redirect(
      `/events/${eventId}/edit?error=You are not authorized to restore this event`
    );
  } else {
    const result = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        deletedAt: null,
      },
    });

    if (!result) {
      return json({ error: 'Restore Event Failed', status: 400 });
    }
    return redirect('/events?success=Restored Event Success!!');
  }
};

export const getDeletedEvents = async (userId: string) => {
  const events = await prisma.event.findMany({
    where: {
      AND: [
        {
          deletedAt: {
            not: null,
          },
        },
        {
          authorId: userId,
        },
      ],
    },
  });

  return json({ events, status: 200 });
};

export const getEventsByDay = async (date: string, authorId?: string) => {
  let targetDate = new Date(date);

  const startDate = new Date(
    targetDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
  );
  const endDate = new Date(
    targetDate.toISOString().split('T')[0] + 'T23:59:59.999Z'
  );

  const events = authorId
    ? await prisma.event.findMany({
        where: {
          AND: [
            { authorId },
            {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
            { deletedAt: null },
          ],
        },
      })
    : await prisma.event.findMany({
        where: {
          AND: [
            {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
            { deletedAt: null },
          ],
        },
      });

  return events;
};

export const getEventsByMonth = async (
  monthParam: string,
  yearParam: string,
  authorId?: string
) => {
  const month = monthParam ? monthParam : new Date().getMonth() + 1;
  const year = yearParam ? yearParam : new Date().getFullYear();
  const lastDay = new Date(Number(year), Number(month) + 1, 0).getDate();
  const events = authorId
    ? await prisma.event.findMany({
        where: {
          AND: [
            { authorId },
            { deletedAt: null },
            {
              date: {
                gte: new Date(`${year}-${month}-1`),
                lte: new Date(`${year}-${month}-${lastDay}`),
              },
            },
          ],
        },
      })
    : await prisma.event.findMany({
        where: {
          AND: [
            { deletedAt: null },
            {
              date: {
                gte: new Date(`${year}-${month}-1`),
                lte: new Date(`${year}-${month}-${lastDay}`),
              },
            },
          ],
        },
      });

  return events;
};
