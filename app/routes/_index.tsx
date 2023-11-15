import type { MetaFunction } from '@remix-run/node';
import FormEvent from '~/shared/components/FormEvent';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Calendar App' },
    { name: 'description', content: 'Welcome to Remix Calendar App!' },
  ];
};

export default function Index() {
  return (
    <div className="home">
      <div className="row">
        <div className="col col-3">
          <div className="sidebar">
            <FormEvent />
          </div>
        </div>
        <div className="col col-9"></div>
      </div>
    </div>
  );
}
