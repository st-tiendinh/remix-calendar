import type { MetaFunction } from '@remix-run/node';
import CalendarWrapper from '~/shared/components/CalendarWrapper';

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
      <CalendarWrapper />
    </div>
  );
}
