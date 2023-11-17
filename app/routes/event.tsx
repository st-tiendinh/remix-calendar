import { redirect, type LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getUserId } from '~/server/auth.server';
import { getEvents } from '~/server/event.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);
  
  if(!userId) return redirect('/login')

  return await getEvents();
};

export default function EventList() {
  const data: any = useLoaderData();

  const events = data?.event;

  return (
    <>
      {events.map((event: any) => (
        <div key={event.id}>
          <Link to={`/event/${event.id}/edit`}>{event.title}</Link>
        </div>
      ))}
    </>
  );
}
