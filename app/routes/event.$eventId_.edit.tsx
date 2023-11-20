import { ActionFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserId } from '~/server/auth.server';
import { deleteEvent } from '~/server/event.server';
import { prisma } from '~/server/prisma.server';
import FormEvent from '~/shared/components/FormEvent';

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get('_action');
  if (action === 'delete') {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ error: 'You must login to delete' });
    }
    if (!params.eventId) return json({ error: 'Event not found' });
    return await deleteEvent(params.eventId, userId);
  }
};
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  //const result = new URL(request.url).searchParams.get('result');
  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  return json({ event });
};

export default function Edit() {
  const { event } = useLoaderData<typeof loader>();
  const actionData: any = useActionData();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    }
  }, [actionData]);
  return <FormEvent data={event} />;
}
