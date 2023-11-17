import { ActionFunction, json } from '@remix-run/node';
import { makeDomainFunction } from 'domain-functions';
import { performMutation } from 'remix-forms';
import { getUserId } from '~/server/auth.server';
import { createEvent } from '~/server/event.server';
import FormEvent, { eventSchema } from '~/shared/components/FormEvent';

const mutation = makeDomainFunction(eventSchema)(async (values) => {
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
  return <FormEvent />;
}
