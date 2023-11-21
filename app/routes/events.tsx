import { redirect, type LoaderFunction, json } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserId } from '~/server/auth.server';
import { getEvents } from '~/server/event.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) return redirect('/login');

  const url = new URL(request.url)
  const message = url.searchParams.get('message')

  const events= await getEvents();

  if(!events) return json({message: 'No events found'}, 404)

  if(message){
    return json({events: events, message})
  }

  return json({events: events});
};

export default function EventList() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  const {events, message} = data;

  useEffect(() => {
    if (message) {
      toast.success(`${message}`);
    }
  },[message]) 

  return (
    <>
      <div className="home">
        <div className="row">
          <div className={`col col-3 sidebar`}>
            <div className="sidebar-header">
              <i className="icon icon-list"></i>
              {location.pathname === '/events' ? (
                <Link to={'/events/create'}>
                  <i className="icon icon-plus"></i>
                </Link>
              ) : (
                <Link to={'/events'}>
                  <i className="icon icon-arrow-left"></i>
                </Link>
              )}
            </div>
            {location.pathname === '/events' ? (
              events.map((event: any) => (
                <div key={event.id}>
                  <Link to={`/events/${event.id}/edit`}>{event.title}</Link>
                </div>
              ))
            ) : (
              <Outlet />
            )}
          </div>

          <div className="col col-9"></div>
        </div>
      </div>
    </>
  );
}
