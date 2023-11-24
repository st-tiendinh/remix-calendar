import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEventsByDay, getEventsByMonth } from '~/server/event.server';
import { prisma } from '~/server/prisma.server';
import CalendarWrapper from '~/shared/components/CalendarWrapper';
import Modal from '~/shared/components/Modal';
import Sidebar from '~/shared/components/Sidebar';
import { resolveModal } from '~/shared/helper/resolveModal.server';
import { getSearchParams } from '~/shared/utils/getSearchParams.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const myParams = new URL(request.url).searchParams;
  const filterParams = myParams.get('filter');
  const dayParams = myParams.get('day');
  const monthParams = myParams.get('month');
  const yearParams = myParams.get('year');
  const paramsValue = getSearchParams({ url: request.url });

  let events;

  if (filterParams && filterParams === 'day') {
    if (dayParams && monthParams && yearParams) {
      events = await getEventsByDay(
        `${yearParams}-${monthParams}-${dayParams}`
      );
    } else {
      events = await getEventsByDay(`${new Date().toLocaleDateString()}`);
    }
  } else {
    events = await getEventsByMonth(
      monthParams as string,
      yearParams as string
    );
  }
  if (!events) {
    return json({ error: 'Events Not Found', status: 404 });
  }

  const id = paramsValue.eventId;

  if (id) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) return redirect('?error= Event not found!!');

    const author = await prisma.user.findUnique({
      where: { id: event.authorId },
    });

    const eventData = { ...event, authorName: author?.profile };

    return resolveModal(
      paramsValue,
      { eventData, eventId: id },
      {
        events,
        status: 200,
        paramsValue,
      }
    );
  }

  return json({ events, status: 200, paramsValue });
};

export default function EventList() {
  const data: any = useLoaderData<typeof loader>();
  const { events, paramsValue, modalProps } = data;

  useEffect(() => {
    if (paramsValue?.success) {
      toast.success(`${paramsValue?.success}`);
    } else if (paramsValue?.error) {
      toast.error(`${paramsValue?.error}`);
    }
  }, [paramsValue]);

  return (
    <>
      <Modal modalProps={modalProps} />
      <div className="home">
        <div className="row">
          <Sidebar events={events} />
          <div className="col col-9">
            <CalendarWrapper eventList={events} />
          </div>
        </div>
      </div>
    </>
  );
}
