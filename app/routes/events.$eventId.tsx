import { json, type LoaderFunction } from '@remix-run/node';
import { prisma } from '~/server/prisma.server';

export let loader: LoaderFunction = async ({ params }) => {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });
  
  return json({ event });
};
