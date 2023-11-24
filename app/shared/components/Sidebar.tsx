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
        <button className="btn">
          <i className="icon icon-list"></i>
        </button>
        {location.pathname === '/events' ? (
          <Link to={'/events/create'}>
            <button className="btn">
              <i className="icon icon-plus"></i>
            </button>
          </Link>
        ) : (
          <Link to={'/events'}>
            <button className="btn">
              <i className="icon icon-arrow-left"></i>
            </button>
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
