import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUserId } from '~/server/auth.server';
import { deleteEvent } from '~/server/event.server';

export const action: ActionFunction = async ({ params, request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: 'You must login to delete', status: 403 });
  }

  if (!params.eventId) return json({ error: 'Event not found', status: 404 });
  console.log(await deleteEvent(params.eventId, userId));
  return await deleteEvent(params.eventId, userId);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  return null;
};
