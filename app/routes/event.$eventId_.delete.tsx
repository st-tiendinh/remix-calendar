import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getUserId } from '~/server/auth.server';
import { deleteEvent } from '~/server/event.server';

export const action: ActionFunction = async ({ params, request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: 'You must login to delete' });
  }
  if (!params.eventId) return json({ error: 'Event not found' });
  const result = await deleteEvent(params.eventId, userId);
  if (!result) {
    return redirect(`/event/${params.eventId}/edit?result=false`);
  }
  return redirect('/');
};
