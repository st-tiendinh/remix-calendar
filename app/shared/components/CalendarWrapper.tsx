import {
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useRef, useMemo, useState } from 'react';
import { formatTimeToISOString } from '../utils/formatNumberToDateString';

import CalendarColumnHeader from './CalendarColumnHeader';
import CalendarEventBar from './CalendarEventBar';
import type { CalendarEvent } from '../utils/types.server';
import SvgCamera from './icons/IcCamera';

export enum EventType {
  TEAM_MEETING = 'team_meeting',
  OFFLINE_TEAM_MEETING = 'offline_team_meeting',
  INTERVIEW = 'interview',
  DINING_PARTY = 'dining_party',
  BIRTHDAY = 'birthday',
}

type CalendarWrapperProps = {
  eventList: CalendarEvent[];
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const calendarRef = useRef(null);
  const location = useLocation();
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (
      location.pathname === '/events' &&
      location.search !== query &&
      location.search !== ''
    ) {
      setQuery(location.search);
    }
  }, [location.search]);

  /* === Customize calendar event === */
  useEffect(() => {
    const filter = params.get('filter');
    if (filter) {
      const currentDate = initialDate();
      const viewType: any = {
        day: 'timeGridDay',
        week: 'timeGridWeek',
        month: 'dayGridMonth',
      };
      (calendarRef.current as any).getApi().changeView(viewType[`${filter}`]);
      (calendarRef.current as any).getApi().gotoDate(currentDate);
    }
  }, [params]);

  const initialDate = () => {
    const day = params.get('day') ? params.get('day') : new Date().getDate();
    const month = params.get('month')
      ? params.get('month')
      : new Date().getMonth() + 1;
    const year = params.get('year')
      ? params.get('year')
      : new Date().getFullYear();
    return new Date(`${year}-${month}-${day}`);
  };

  const initialView = () => {
    const filter = params.get('filter');
    if (filter) {
      switch (filter) {
        case 'day':
          return 'timeGridDay';
        case 'month':
          return 'dayGridMonth';
        case 'week':
          return 'timeGridWeek';
        default:
          break;
      }
    } else {
      return 'timeGridWeek';
    }
  };

  /* This is the test event types function. Delete it after define event types in DB */
  const getRandomEventType = () => {
    const eventTypes = Object.values(EventType);
    const randomIndex = Math.floor(Math.random() * eventTypes.length);
    return eventTypes[randomIndex];
  };

  const formatDateArray = useMemo(() => {
    return eventList.map((event: CalendarEvent) => {
      return {
        id: event.id,
        title: event.title,
        meetingLink: event.meetingLink,
        eventType: getRandomEventType(),
        // eventType: EventType.BIRTHDAY,
        start: formatTimeToISOString(event.timeStart, event.date),
        end: formatTimeToISOString(event.timeEnd, event.date),
        durationEditable: true,
      };
    });
  }, [eventList]);

  const customizeDayHeaderContent = (info: any) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNumber = info.date.getUTCDay();

    return (
      <CalendarColumnHeader
        dateName={days[dayNumber]}
        dateValue={info.view.type === 'timeGridWeek' ? info.date.getDate() : ''}
      />
    );
  };

  const customEventBar = (info: any) => {
    const { timeText, event } = info;
    return (
      <CalendarEventBar
        isHasMeetingLink={!!event._def.extendedProps.meetingLink}
        eventType={event._def.extendedProps.eventType}
        eventTime={timeText}
        eventTitle={event._def.title}
      />
    );
  };

  const customEventBackground = (info: any) => {
    const { el, event } = info;
    switch (event._def.extendedProps.eventType) {
      case EventType.TEAM_MEETING:
        el.classList.add('bg-violet-light');
        el.classList.add('border-left-violet');
        break;

      case EventType.OFFLINE_TEAM_MEETING:
        el.classList.add('bg-blue-light');
        el.classList.add('border-left-blue');
        break;

      case EventType.DINING_PARTY:
        el.classList.add('bg-green-light');
        el.classList.add('border-left-green');
        break;

      case EventType.INTERVIEW:
        el.classList.add('bg-amber-light');
        el.classList.add('border-left-amber');
        break;

      case EventType.BIRTHDAY:
        el.classList.add('bg-rose-light');
        el.classList.add('border-left-rose');
        break;

      default:
        break;
    }
  };

  /* === Handle event of calendar === */

  const handleEventClick = (info: any) => {
    navigate(`/events/${info.event._def.publicId}`, {
      state: {
        query,
      },
    });
  };

  const handleGetAllDayEvents = () => {
    (calendarRef.current as any).getApi().changeView('timeGridDay');
    (calendarRef.current as any).getApi().gotoDate(new Date());
    const now = new Date();

    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    navigate(`/events?filter=day&day=${day}&month=${month}&year=${year}`);
  };

  const handleMoveDate = (step: number) => {
    if (step > 0) {
      (calendarRef.current as any).getApi().next();
    } else {
      (calendarRef.current as any).getApi().prev();
    }
    const filter = params.get('filter') || 'week';
    const originalDay = params.get('day')
      ? Number(params.get('day'))
      : new Date().getDate();
    const originalMonth = params.get('month')
      ? Number(params.get('month'))
      : new Date().getMonth() + 1;
    const originalYear = params.get('year')
      ? Number(params.get('year'))
      : new Date().getFullYear();

    const now = new Date(originalYear, originalMonth - 1, originalDay);

    switch (filter) {
      case 'day':
        now.setDate(now.getDate() + step);
        break;
      case 'week':
        now.setDate(now.getDate() + 7 * step);
        break;
      case 'month':
        now.setMonth(now.getMonth() + step);
        break;
      default:
        break;
    }

    navigate(
      `/events?filter=${filter}&day=${now.getDate()}&month=${
        now.getMonth() + 1
      }&year=${now.getFullYear()}`
    );
  };

  const handleChangeViewToMonth = () => {
    const currentDate = initialDate();
    (calendarRef.current as any).getApi().changeView('dayGridMonth');
    navigate(
      `/events?filter=month&month=${
        currentDate.getMonth() + 1
      }&year=${currentDate.getFullYear()}`
    );
  };

  const handleChangeViewToWeek = () => {
    const currentDate = initialDate();
    (calendarRef.current as any).getApi().changeView('timeGridWeek');
    navigate(
      `/events?filter=week&day=${currentDate.getDate()}&month=${
        currentDate.getMonth() + 1
      }&year=${currentDate.getFullYear()}`
    );
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

  const handleClickDate = (info: any) => {
    const date = new Date(info.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (date.setHours(0, 0, 0, 0) < now.getTime()) {
      return;
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    navigate(`/events/create`, {
      state: {
        event: {
          date,
          timeStart:
            `${hours}:${minutes}` === '00:00'
              ? `${String(new Date().getHours()).padStart(2, '0')}: ${String(
                  new Date().getMinutes()
                ).padStart(2, '0')}`
              : `${hours}:${minutes}`,
        },
        query,
      },
    });
  };

  return (
    <div className="calendar-wrapper">
      <SvgCamera />
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
          timeGridWeek: {
            text: 'Week',
            click: handleChangeViewToWeek,
          },
          next: {
            text: 'Next',
            click: () => {
              if (navigation.state !== 'loading') {
                handleMoveDate(1);
              }
            },
          },
          prev: {
            text: 'Prev',
            click: () => {
              if (navigation.state !== 'loading') {
                handleMoveDate(-1);
              }
            },
          },
        }}
        initialView={initialView()}
        initialDate={initialDate()}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          start: 'prev,today,next',
          center: 'title',
          end: 'timeGridWeek,dayGridMonth,timeGridDay',
        }}
        dateClick={handleClickDate}
        allDaySlot={false}
        editable={true}
        selectable={true}
        dayMaxEventRows={true}
        dayHeaderContent={customizeDayHeaderContent}
        events={formatDateArray}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        }}
        eventBorderColor="transparent"
        eventDidMount={customEventBackground}
        eventContent={customEventBar}
        eventDisplay="background-reverse"
      />
    </div>
  );
}
