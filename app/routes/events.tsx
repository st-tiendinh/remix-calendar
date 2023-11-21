import { type LoaderFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { getEvents } from '~/server/event.server';
import CalendarWrapper from '~/shared/components/CalendarWrapper';

export const loader: LoaderFunction = async ({ request }) => {
  // const userId = await getUserId(request);

  // if (!userId) return redirect('/login');
  return await getEvents();
};

export default function EventList() {
  const data: any = useLoaderData();
  const location = useLocation();
  const events = data?.event;

  return (
    <>
      <div className="home">
        <div className="row">
          <div className={`col col-3 sidebar`}>
            <div className="sidebar-header">
              <i className="icon icon-list"></i>
              <i className="icon icon-arrow-left"></i>
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

          <div className="col col-9">
            <CalendarWrapper eventList={events} />
          </div>
        </div>
      </div>
    </>
  );
}
