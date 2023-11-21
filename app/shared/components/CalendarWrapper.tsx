import { useNavigate } from '@remix-run/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { formatNumberToDateString } from '../utils/formatNumberToDateString';

type CalendarWrapperProps = {
  eventList: any;
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const navigate = useNavigate();

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

  return (
    <div className="calendar-wrapper">
      <FullCalendar
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
