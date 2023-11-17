import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { prisma } from '~/server/prisma.server';
import FormEvent from '~/shared/components/FormEvent';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const result = new URL(request.url).searchParams.get('result');
  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  return json({ event, result });
};

export default function Edit() {
  const { event, result } = useLoaderData<typeof loader>();
  useEffect(() => {
    // if (result === 'false') {
    // console.log('ahaha');
    toast.error('Delete Failed');
    // alert('DELETE Failed');
  }, [result]);
  toast.error('Delete Failed');
  return <FormEvent data={event} />;
}
