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
