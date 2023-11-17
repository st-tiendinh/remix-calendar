import { useActionData } from '@remix-run/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from '@remix-run/node';
import { makeDomainFunction, InputError } from 'domain-functions';
import { performMutation } from 'remix-forms';

import { updateEvent } from '~/server/event.server';
import FormEvent, {
  FormEventMethod,
  eventSchema,
} from '~/shared/components/FormEvent';
import { validateEventDate } from '~/shared/utils/validators.server';
import { getUserId } from '~/server/auth.server';
import { prisma } from '~/server/prisma.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  return null;
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

export const action = async ({ params, request }: ActionFunctionArgs) => {
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
};

export default function EventEdit() {
  const actionData: any = useActionData();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    } else if (actionData?.message) {
      toast.success(actionData.message);
    }
  }, [actionData]);

  return <FormEvent method={FormEventMethod.UPDATE} />;
}
