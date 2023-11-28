import { useNavigate, useSearchParams } from '@remix-run/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { formatTimeToISOString } from '../utils/formatNumberToDateString';
import { useMemo, useRef } from 'react';
import { ModalAction, ModalType } from './Modal';

type CalendarWrapperProps = {
  eventList: any;
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const formatDateArray = useMemo(() => {
    return eventList.map((event: any) => {
      return {
        id: event.id,
        title: event.title,
        meetingLink: event.meetingLink,
        start: formatTimeToISOString(event.timeStart, event.date),
        end: formatTimeToISOString(event.timeEnd, event.date),
        durationEditable: true,
      };
    });
  }, [eventList]);

  const customizeDayHeaderContent = (info: any) => {
    switch (info.date.getUTCDay()) {
      case 0:
        return (
          <>
            <span className="day-header-name">Sun</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 1:
        return (
          <>
            <span className="day-header-name">Mon</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 2:
        return (
          <>
            <span className="day-header-name">Tue</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 3:
        return (
          <>
            <span className="day-header-name">Wed</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 4:
        return (
          <>
            <span className="day-header-name">Thu</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 5:
        return (
          <>
            <span className="day-header-name">Fri</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      case 6:
        return (
          <>
            <span className="day-header-name">Sat</span>
            <span className="day-header-value">{info.date.getDate()}</span>
          </>
        );
      default:
        return null;
    }
  };

  const customEventCell = (info: any) => {
    const { event, el, timeText } = info;
    const isHasMeetingLink = !!event._def.extendedProps.meetingLink;
    if (isHasMeetingLink) {
      el.classList.add('meeting-link');
    } else {
      el.classList.add('no-meeting-link');
    }
    const eventTime = el.querySelector('.fc-event-time') as any;
    eventTime.innerHTML = `
      ${
        isHasMeetingLink
          ? `
      <span class='event-icon-wrapper ${
        isHasMeetingLink ? 'bg-violet' : 'bg-blue'
      }'>
        <i class="icon icon-camera"></i>
      </span>
      `
          : ''
      }
      <span class='event-time'>${timeText}</span>
    `;
  };

  const handleSelect = (info: any) => {
    console.log('info: ', info);
  };

  const handleEventClick = (info: any) => {
    navigate(
      `/events?modal-type=${ModalType.DATA}&modal-action=${ModalAction.SHOW_EVENT}&event-id=${info.event._def.publicId}`
    );
  };

  const handleGetAllDayEvents = () => {
    (calendarRef.current as any).getApi().changeView('timeGridDay');
    (calendarRef.current as any).getApi().gotoDate(new Date());
    const now = new Date().toLocaleDateString();
    const month = now.split('/')[0];
    const day = now.split('/')[1];
    const year = now.split('/')[2];
    navigate(`/events?filter=day&day=${day}&month=${month}&year=${year}`);
  };

  const handleMoveDay = (step: number) => {
    if (step > 0) {
      (calendarRef.current as any).getApi().next();
    } else {
      (calendarRef.current as any).getApi().prev();
    }
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

  const handleMoveMonth = (step: number) => {
    if (step > 0) {
      (calendarRef.current as any).getApi().next();
    } else {
      (calendarRef.current as any).getApi().prev();
    }
    let month = params.get('month')
      ? Number(params.get('month')) + step
      : new Date().getMonth() + 1 + step;
    month = month > 12 ? 1 : month < 1 ? 12 : month;

    let year = params.get('year')
      ? Number(params.get('year'))
      : new Date().getFullYear();
    year = month > 12 ? year + 1 : month < 1 ? year - 1 : year;
    navigate(`/events?filter=month&month=${month}&year=${year}`);
  };

  const handleChangeViewToMonth = () => {
    let month = params.get('month');
    month = month ? month : (new Date().getMonth() + 1).toString();
    let year = params.get('year');
    year = year ? year : new Date().getFullYear().toString();
    (calendarRef.current as any).getApi().changeView('dayGridMonth');
    navigate(`/events?filter=month&month=${month}&year=${year}`);
  };

  const handleBackToday = () => {
    const filter = params.get('filter');
    const now = new Date().toLocaleDateString();
    const month = now.split('/')[0];
    const year = now.split('/')[2];

    if (filter === 'day') {
      handleGetAllDayEvents();
    } else {
      (calendarRef.current as any).getApi().gotoDate(new Date());
      navigate(`/events?filter=month&month=${month}&year=${year}`);
    }
  };

  return (
    <div className="calendar-wrapper">
      <i className="icon icon-camera"></i>
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          today: {
            text: 'Today',
            click: handleBackToday,
          },
          timeGridDay: {
            text: 'Day',
            click: handleGetAllDayEvents,
          },
          dayGridMonth: {
            text: 'Month',
            click: handleChangeViewToMonth,
          },
          next: {
            text: 'Next',
            click: () => {
              if (params.get('filter') === 'day') {
                handleMoveDay(1);
              } else {
                handleMoveMonth(1);
              }
            },
          },
          prev: {
            text: 'Prev',
            click: () => {
              if (params.get('filter') === 'day') {
                handleMoveDay(-1);
              } else {
                handleMoveMonth(-1);
              }
            },
          },
        }}
        initialView="timeGridWeek"
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
        dayMaxEventRows={true}
        dayHeaderContent={customizeDayHeaderContent}
        events={formatDateArray}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        }}
        eventDidMount={customEventCell}
      />
    </div>
  );
}
