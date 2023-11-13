import type { MetaFunction } from '@remix-run/node';
import CalendarContainer from '~/components/CalendarContainer';
import Sidebar from '~/components/Sidebar';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

// ./app/routes/index.tsx
export default function Index() {
  return (
    <div className="page-home">
      <div className="row">
        <div className="col col-3">
          <Sidebar />
        </div>
        <div className="col col-9">
          <CalendarContainer />
        </div>
      </div>
    </div>
  );
}
