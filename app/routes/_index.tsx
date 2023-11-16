import {
  redirect,
  type ActionFunction,
  type MetaFunction,
} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Calendar App' },
    { name: 'description', content: 'Welcome to Remix Calendar App!' },
  ];
};
export const loader: ActionFunction = async () => {
  return redirect('/event');
};

export default function Index() {
  return <></>;
}
