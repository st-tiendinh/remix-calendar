import { useNavigate, useNavigation, useSearchParams } from '@remix-run/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useRef, useMemo } from 'react';
import { formatTimeToISOString } from '../utils/formatNumberToDateString';
import { ModalAction, ModalType } from './Modal';

type CalendarWrapperProps = {
  eventList: any;
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const calendarRef = useRef(null);

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
    }
  };
  const formatDateArray = useMemo(() => {
    return eventList.map((event: any) => {
      return {
        id: event.id,
        title: event.title,
        start: formatTimeToISOString(event.timeStart, event.date),
        end: formatTimeToISOString(event.timeEnd, event.date),
        durationEditable: true,
      };
    });
  }, [eventList]);

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

  const handleMoveDate = (step: number) => {
    if (step > 0) {
      (calendarRef.current as any).getApi().next();
    } else {
      (calendarRef.current as any).getApi().prev();
    }
    const filter = params.get('filter') || 'month';
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

  return (
    <div className="calendar-wrapper">
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
        initialView={initialView()}
        initialDate={initialDate()}
      />
    </div>
  );
}
