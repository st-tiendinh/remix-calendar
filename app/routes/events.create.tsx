import { type ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';

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
import { getSearchParams } from '~/shared/utils/getSearchParams.server';

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

export const loader: LoaderFunction = async ({ request }) => {
  const paramValues = getSearchParams({ url: request.url });
  if (!paramValues) return null;
  console.log(paramValues.timeStart);
  return json({
    event: { date: paramValues.date, timeStart: paramValues.timeStart },
  });
};

export default function EventCreate() {
  const actionData: ActionData | undefined = useActionData();
  const loaderData = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionData?.error !== undefined) {
      toast.error(`${actionData?.error}`);
    } else if (actionData?.message) {
      toast.success(`${actionData?.message}`);
    }
  }, [actionData]);

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-event-wrapper">
          <FormEvent method={FormEventMethod.CREATE} event={loaderData.event} />
        </div>
      </div>
    </div>
  );
}
