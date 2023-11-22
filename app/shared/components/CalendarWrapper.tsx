import { useNavigate, useSearchParams } from '@remix-run/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { formatNumberToDateString } from '../utils/formatNumberToDateString';
import { useRef } from 'react';

type CalendarWrapperProps = {
  eventList: any;
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const formatDateArray = eventList.map((event: any) => {
    return {
      id: event.id,
      title: event.title,
      start: formatNumberToDateString(event.timeStart, event.date),
      end: formatNumberToDateString(event.timeEnd, event.date),
      durationEditable: true,
    };
  });

  const handleSelect = (info: any) => {
    console.log('info: ', info);
  };

  const handleEventClick = (info: any) => {
    navigate(`/events/${info.event._def.publicId}`);
  };

  const handleGetAllDayEvents = (info: any) => {
    navigate(`/events?filter=day`);
  };

  const handleMoveDay = (step: number) => {
    let originalDay = params.get('day')
      ? Number(params.get('day'))
      : new Date().getDate();
    let originalMonth = params.get('month')
      ? Number(params.get('month')) - 1
      : new Date().getMonth();
    let originalYear = params.get('year')
      ? Number(params.get('year'))
      : new Date().getFullYear();

    const now = new Date(originalYear, originalMonth, originalDay);
    now.setDate(now.getDate() + step);

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    navigate(`/events?filter=day&day=${day}&month=${month}&year=${year}`);
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          day: {
            text: 'Day',
            click: handleGetAllDayEvents,
          },
          next: {
            text: 'Next',
            click: () => {
              handleMoveDay(1);
              if (calendarRef.current) {
                (calendarRef.current as any).getApi().next();
              }
            },
          },
          prev: {
            text: 'Prev',
            click: () => {
              handleMoveDay(-1);
              if (calendarRef.current) {
                (calendarRef.current as any).getApi().prev();
              }
            },
          },
        }}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          start: 'prev,today,next',
          center: 'title',
          end: 'timeGridWeek,dayGridMonth,timeGridDay',
        }}
        allDaySlot={false}
        editable={true}
        selectable={true}
        select={handleSelect}
        events={formatDateArray}
        eventClick={handleEventClick}
        dayMaxEventRows={true}
      />
    </div>
  );
}
