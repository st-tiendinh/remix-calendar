import { ActionFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { InputError, makeDomainFunction } from 'domain-functions';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { performMutation } from 'remix-forms';
import { getUserId } from '~/server/auth.server';
import { deleteEvent, updateEvent } from '~/server/event.server';
import { prisma } from '~/server/prisma.server';
import FormEvent, {
  FormEventMethod,
  eventSchema,
} from '~/shared/components/FormEvent';
import { EventData } from '~/shared/utils/types.server';
import { validateEventDate } from '~/shared/utils/validators.server';

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
  } else {
    const result = await performMutation({
      request,
      schema: eventSchema,
      mutation,
    });

    if (!result.success) return json(result, 400);

    const userId = await getUserId(request);
    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
    });

    if (!event) return json({ error: 'Event is not exist', status: 404 });

    if (event.authorId !== userId)
      return json({ error: 'You can not edit this event', status: 403 });

    if (!userId) return json({ error: 'You must to login first', status: 401 });

    return await updateEvent(
      { ...result.data, authorId: userId },
      params.eventId as string
    );
  }
};
const mutation = makeDomainFunction(eventSchema)(async (values) => {
  const eventDate = values.date;
  const errors = {
    date: validateEventDate(eventDate),
  };

  if (errors.date) {
    throw new InputError(errors.date, 'date');
  }

  return values;
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const event = await prisma.event.findUnique({
    where: {
      id: params.eventId,
    },
  });

  return json({ event });
};

export default function EventEdit() {
  const actionData: any = useActionData();
  const { event }: any = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    } else if (actionData?.message) {
      toast.success(actionData.message);
    }
  }, [actionData]);

  return <FormEvent method={FormEventMethod.UPDATE} event={event} />;
}
