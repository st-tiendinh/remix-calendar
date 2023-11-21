import { redirect, type LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserId } from '~/server/auth.server';
import { getEvents } from '~/server/event.server';
import Sidebar from '~/shared/components/Sidebar';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) return redirect('/login');

  const url = new URL(request.url);
  const message = url.searchParams.get('message');

  const events = await getEvents();

  if (!events) return json({ message: 'No events found' }, 404);

  if (message) {
    return json({ events: events, message });
  }

  return json({ events: events });
};

export default function EventList() {
  const data = useLoaderData<typeof loader>();

  const { events, message } = data;

  useEffect(() => {
    if (message) {
      toast.success(`${message}`);
    }
  }, [message]);

  return (
    <>
      <div className="home">
        <div className="row">
          <Sidebar events={events} />
          <div className="col col-9"></div>
        </div>
      </div>
    </>
  );
}
