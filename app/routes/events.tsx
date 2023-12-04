import { json, redirect, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getEventsByDay, getEventsByMonth } from '~/server/event.server';

import CalendarWrapper from '~/shared/components/CalendarWrapper';
import Sidebar from '~/shared/components/Sidebar';
import Header from '~/shared/components/Header';

import { getSearchParams } from '~/shared/utils/getSearchParams.server';
import { getUser } from '~/server/auth.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const myParams = new URL(request.url).searchParams;
  const filterParams = myParams.get('filter');
  const dayParams = myParams.get('day');
  const monthParams = myParams.get('month');
  const yearParams = myParams.get('year');
  const paramsValue = getSearchParams({ url: request.url });
  const userInfo = await getUser(request);

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

  const todayEvent = await getEventsByDay(`${new Date().toLocaleDateString()}`);

  if (!todayEvent) {
    return json({ error: 'Today event not found!!', status: 404 });
  }

  return json({
    events,
    paramsValue,
    eventsByMonth,
    todayEvent,
    userInfo: userInfo?.profile,
    status: 200,
  });
};

export default function EventList() {
  const data: any = useLoaderData<typeof loader>();
  const { events, paramsValue, todayEvent, userInfo } = data;
  const [isShow, setIsShow] = useState(true);

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
            <Sidebar todayEvent={todayEvent} isShow={isShow} />
          </div>
          <div
            className={`col col-9 col-md-8 ${isShow ? '' : ' full-calendar'}`}
          >
            <CalendarWrapper eventList={events} />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
