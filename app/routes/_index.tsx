import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { requireUserId } from '~/server/auth.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Index() {
  return (
    <div className="">
      <h2 className="text-danger">Sass Is Working!</h2>
    </div>
  );
}
