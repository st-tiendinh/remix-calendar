import { Link, Outlet, useLocation } from '@remix-run/react';

import { type EventData } from '../utils/types.server';
import EventList from './EventList';

interface SidebarProps {
  events: EventData[];
}

export default function Sidebar({ events }: SidebarProps) {
  const location = useLocation();
  return (
    <div className="col col-3 sidebar">
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
        <EventList events={events} />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
