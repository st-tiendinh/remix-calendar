import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { getEventsByDay, getEventsByMonth } from '~/server/event.server';
import { getSearchParams } from '~/shared/utils/getSearchParams.server';
import { getUser, requireUserId } from '~/server/auth.server';
import { getAllAdmin } from '~/server/user.server';
import type { CalendarEvent } from '~/shared/utils/types.server';

import CalendarWrapper from '~/shared/components/CalendarWrapper';
import Sidebar from '~/shared/components/Sidebar';
import Header from '~/shared/components/Header';

export const loader: LoaderFunction = async ({ request, params }) => {
  const myParams = new URL(request.url).searchParams;
  const filterParams = myParams.get('filter');
  const dayParams = myParams.get('day');
  const monthParams = myParams.get('month');
  const yearParams = myParams.get('year');

  const paramsValue = getSearchParams({ url: request.url });
  const userInfo = await getUser(request);
  const currentUserId = await requireUserId(request);

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
    return redirect('?error= Event not found!!');
  }

  const todayEvent = await getEventsByDay(
    `${new Date().toLocaleDateString()}`,
    currentUserId
  );

  if (!todayEvent) {
    return json({ error: 'Today event not found!!', status: 404 });
  }

  const adminList = await getAllAdmin();

  return json({
    events,
    paramsValue,
    eventsByMonth,
    todayEvent,
    userInfo: userInfo?.profile,
    adminList,
    status: 200,
  });
};

export default function EventList() {
  const data: any = useLoaderData<typeof loader>();
  const { events, paramsValue, todayEvent, userInfo, adminList } = data;
  const [isShow, setIsShow] = useState(true);
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>(events);

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const authorId = e.target.value;

    if (e.target.checked) {
      // Add the events of the checked author to userEvents
      const newEvents = events
        .filter((event: CalendarEvent) => event.authorId === authorId)
        .map((event: CalendarEvent) => ({
          ...event,
        }));
      setUserEvents((prevEvents) => [...prevEvents, ...newEvents]);
    } else {
      // Remove the events of the unchecked author from userEvents
      const remainingEvents = userEvents.filter(
        (event) => event.authorId !== authorId
      );
      setUserEvents(remainingEvents);
    }
  };

  useEffect(() => {
    if (paramsValue?.success) {
      toast.success(`${paramsValue?.success}`);
    } else if (paramsValue?.error) {
      toast.error(`${paramsValue?.error}`);
    }
  }, [paramsValue]);

  return (
    <>
      <Header setShowSidebar={setIsShow} userInfo={userInfo} />
      <div className="home">
        <div className="row">
          <div
            className={`col col-3 col-md-4 sidebar ${
              isShow ? '' : 'sidebar-sm'
            }`}
          >
            <Sidebar
              todayEvent={todayEvent}
              isShow={isShow}
              handleChecked={handleChecked}
              adminList={adminList}
            />
          </div>
          <div
            className={`col col-9 col-md-8 ${isShow ? '' : ' full-calendar'}`}
          >
            <CalendarWrapper eventList={userEvents} />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
