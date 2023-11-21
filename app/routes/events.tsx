import { redirect, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUserId } from '~/server/auth.server';
import { getEvents } from '~/server/event.server';
import Sidebar from '~/shared/components/Sidebar';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) return redirect('/login');

  return await getEvents();
};

export default function EventList() {
  const data: any = useLoaderData();
  const events = data?.event;

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
