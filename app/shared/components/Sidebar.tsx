import { Link, Outlet, useLocation } from '@remix-run/react';

import { type EventData } from '../utils/types.server';
import EventDetail from './EventInfoList';

interface SidebarProps {
  events: EventData[];
}

export default function Sidebar({ events }: SidebarProps) {
  const location = useLocation();
  const event = {
    title: '[FE] Weekly meeting',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime, asperiores?',
    date: '2023-11-21',
    location: 'Mars',
    author: 'Tien Dinh N.',
  };
  return (
    <div className="col col-3 sidebar">
      <EventDetail event={event} />
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
  );
}
