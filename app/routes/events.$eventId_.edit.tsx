import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserId } from '~/server/auth.server';
import { deleteEvent, updateEvent } from '~/server/event.server';
import { prisma } from '~/server/prisma.server';
import FormEvent, { FormEventMethod } from '~/shared/components/FormEvent';

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get('_action') as string;

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateValue = formData.get('date');
  let dateFormat;
  if (typeof dateValue === 'string') {
    dateFormat = new Date(dateValue);
  }
  const timeStart = formData.get('timeStart') as string;
  const timeEnd = formData.get('timeEnd') as string;
  const location = formData.get('location') as string;
  const meetingLink = formData.get('meetingLink') as string;

  const userId = await getUserId(request);
  if (action === 'delete') {
    if (!userId) {
      return json({ error: 'You must login to delete' });
    }
    if (!params.eventId) return json({ error: 'Event not found' });
    return await deleteEvent(params.eventId, userId);
  } else {
    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
    });

    if (
      !title ||
      !dateValue ||
      !timeStart ||
      !timeEnd ||
      !description ||
      !location
    ) {
      return json({ error: 'You must fill all fields' });
    }
    if (!dateFormat) {
      return json({ error: 'Date is not valid' });
    }

    if (!event) return json({ error: 'Event is not exist', status: 404 });

    if (event.authorId !== userId)
      return json({ error: 'You can not edit this event', status: 403 });

    if (!userId) return json({ error: 'You must to login first', status: 401 });

    const data = {
      title,
      description,
      date: dateFormat,
      timeStart,
      timeEnd,
      location,
      meetingLink,
    };
    return await updateEvent(
      { ...data, authorId: userId },
      params.eventId as string
    );
  }
};

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
