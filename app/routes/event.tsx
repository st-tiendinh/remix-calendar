import { Outlet } from '@remix-run/react';
import { type LoaderFunction, redirect } from '@remix-run/node';
import CalendarWrapper from '~/shared/components/CalendarWrapper';
import { getUser } from '~/server/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? null : redirect('/login');
};
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
