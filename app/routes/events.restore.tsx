import { type LoaderFunction } from '@remix-run/node';
import { getUserId } from '~/server/auth.server';
import { getDeletedEvents } from '~/server/event.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) as string;

  return await getDeletedEvents(userId as string);
};
