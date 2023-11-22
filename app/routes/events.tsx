import { type LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { getEvents } from '~/server/event.server';
import Sidebar from '~/shared/components/Sidebar';
import { getSearchParams } from '~/shared/utils/getSearchParams.server';

export const loader: LoaderFunction = async ({ request }) => {
  const paramsValue = getSearchParams({ url: request.url });

  const events = await getEvents();

  if (!events) return json({ message: 'No events found' }, 404);

  if (paramsValue) {
    return json({ events: events, paramsValue });
  }

  return json({ events: events });
};

export default function EventList() {
  const data = useLoaderData<typeof loader>();

  const { events, paramsValue } = data;

  useEffect(() => {
    if (paramsValue.success) {
      toast.success(`${paramsValue.success}`);
    } else if (paramsValue.error) {
      toast.error(`${paramsValue.error}`);
    }
  }, [paramsValue]);

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
