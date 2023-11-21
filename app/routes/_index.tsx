import {
  redirect,
  type MetaFunction,
  type LoaderFunction,
} from '@remix-run/node';
import { getUser } from '~/server/auth.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Calendar App' },
    { name: 'description', content: 'Welcome to Remix Calendar App!' },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/events') : redirect('/login');
};

export default function Index() {
  return <></>;
}
