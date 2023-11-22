import { type LoaderFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { getEventsByDay, getEventsByMonth } from '~/server/event.server';
import CalendarWrapper from '~/shared/components/CalendarWrapper';

export const loader: LoaderFunction = async ({ request, params }) => {
  const myParams = new URL(request.url).searchParams;
  const filterParams = myParams.get('filter');
  const dayParams = myParams.get('day');
  const monthParams = myParams.get('month');
  const yearParams = myParams.get('year');

  if (filterParams && filterParams === 'day') {
    if (dayParams && monthParams && yearParams) {
      return getEventsByDay(`${yearParams}-${monthParams}-${dayParams}`);
    } else {
      return getEventsByDay(`${new Date().toLocaleDateString()}`);
    }
  } else {
    return getEventsByMonth(monthParams as string, yearParams as string);
  }
};

export default function EventList() {
  const data: any = useLoaderData();
  const location = useLocation();
  const events = data?.events;

  return (
    <>
      <div className="home">
        <div className="row">
          <div className={`col col-3 sidebar`}>
            <div className="sidebar-header">
              <i className="icon icon-list"></i>
              <i className="icon icon-arrow-left"></i>
            </div>
            {events && location.pathname === '/events' ? (
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
