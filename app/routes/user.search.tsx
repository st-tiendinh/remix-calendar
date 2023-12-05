import { LoaderFunctionArgs, json } from '@remix-run/node';
import { searchUser } from '~/server/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams.get('search') || '';
  const user = await searchUser(search);
  if (!user) {
    return json({ error: 'User Not Found!', status: 404 });
  }
  return json({ status: 200, user });
};
