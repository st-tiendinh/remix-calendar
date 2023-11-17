import { Outlet } from '@remix-run/react';
import CalendarWrapper from '~/shared/components/CalendarWrapper';

export default function Event() {
  return (
    <div className="home">
      <div className="row">
        <div className={`col col-3 sidebar`}>
          <div className="sidebar-header">
            <i className="icon icon-list"></i>
            <i className="icon icon-arrow-left"></i>
          </div>
          <Outlet />
        </div>

        <div className="col col-9">
          <CalendarWrapper />
        </div>
      </div>
    </div>
  );
}
