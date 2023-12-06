import { LoaderFunctionArgs, json } from '@remix-run/node';
import { searchUser } from '~/server/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams.get('search') || '';
  console.log('SEARCH', search);

  const users = await searchUser(search);
  if (!users) {
    return json({ error: 'User Not Found!', status: 404 });
  }
  return json({ status: 200, users });
};
