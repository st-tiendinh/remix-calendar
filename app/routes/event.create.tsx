import { type ActionFunction, json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import { performMutation } from 'remix-forms';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { InputError, makeDomainFunction } from 'domain-functions';

import { getUserId } from '~/server/auth.server';
import { createEvent } from '~/server/event.server';
import FormEvent, {
  FormEventMethod,
  eventSchema,
} from '~/shared/components/FormEvent';
import { type ActionData } from '~/shared/utils/types.server';
import {
  validateEventDate,
  validateEventTime,
} from '~/shared/utils/validators.server';

const mutation = makeDomainFunction(eventSchema)(async (values) => {
  const errorDate = validateEventDate(values.date);

  if (errorDate) throw new InputError(errorDate, 'date');

  const errorTime = validateEventTime(
    values.date,
    values.timeStart,
    values.timeEnd
  );

  if (errorTime) throw new InputError(errorTime, 'timeStart');

  return values;
});

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({
    request,
    schema: eventSchema,
    mutation,
  });
  const userId = await getUserId(request);

  if (!userId)
    return json(
      { success: false, message: 'You must be logged in to create an event' },
      401
    );

  if (!result.success) return json(result, 400);

  const eventData = { ...result.data, authorId: userId };

  return await createEvent(eventData);
};

export default function EventCreate() {
  const actionData: ActionData | undefined = useActionData();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    } else if (actionData?.message) {
      toast.success(`${actionData?.message}`);
    }
  }, [actionData]);

  return <FormEvent method={FormEventMethod.CREATE} />;
}
