import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { Toaster } from 'react-hot-toast';
import { ClientOnly } from 'remix-utils/client-only';

import styles from './styles/app.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
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
        <ClientOnly>
          {() => (
            <Toaster
              toastOptions={{
                success: { duration: 3000 },
                error: { duration: 3000 },
              }}
            />
          )}
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
