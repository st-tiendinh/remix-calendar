import { LoaderFunctionArgs, json } from '@remix-run/node';
import { searchUser } from '~/server/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const search = new URL(request.url).searchParams.get('search');

  let users;
  if (search) {
    users = await searchUser(search as string);
  }
  if (!users || users.length === 0) {
    return json({ error: 'User Not Found!', status: 404 });
  }
  return json({ status: 200, users });
};
