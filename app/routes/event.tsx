import { type LoaderFunction, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { getUser } from '~/server/auth.server';

export const loader: LoaderFunction = async ({request}) => {
  return (await getUser(request)) ? redirect('/event/list') : redirect('/login');
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

        <div className="col col-9"></div>
      </div>
    </div>
  );
}
