import type { MetaFunction } from '@remix-run/node';
import CalendarContainer from '~/components/CalendarContainer';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

// ./app/routes/index.tsx
export default function Index() {
  return (
    <div className="">
      <CalendarContainer />
    </div>
  );
}
