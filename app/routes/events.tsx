import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getUserId } from '~/server/auth.server';
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
  const eventsByMonth = await getEventsByMonth(
    monthParams as string,
    yearParams as string
  );
  if (!events || !eventsByMonth) {
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

    const currentUserId = await getUserId(request);

    const eventData = {
      ...event,
      author: {
        name: author?.profile,
        ...(author?.id === currentUserId && { id: currentUserId }),
      },
    };

    return resolveModal(
      paramsValue,
      { eventData, eventId: id },
      {
        events,
        eventsByMonth,
        status: 200,
        paramsValue,
      }
    );
  }

  return json({ events, status: 200, paramsValue, eventsByMonth });
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

  const [isShow, setIsShow] = useState(true);
  return (
    <>
      <Modal modalProps={modalProps} />
      <div className="home">
        <div className="row">
          <div className={`col col-3  sidebar ${isShow ? '' : 'sidebar-sm'}`}>
            <Sidebar events={events} isShow={isShow} setIsShow={setIsShow} />
          </div>
          <div className={`col col-9 ${isShow ? '' : ' full-calendar'}`}>
            <CalendarWrapper eventList={events} />
          </div>
        </div>
      </div>
    </>
  );
}
