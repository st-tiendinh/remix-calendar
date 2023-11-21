import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { formatNumberToDateString } from '../utils/formatNumberToDateString';

type CalendarWrapperProps = {
  eventList: any;
};

export default function CalendarWrapper({ eventList }: CalendarWrapperProps) {
  const handleSelect = (info: any) => {};

  const formatDateArray = eventList.map((event: any) => {
    console.log(formatNumberToDateString(event.timeStart, event.date));
    return {
      title: event.title,
      start: formatNumberToDateString(event.timeStart, event.date),
      end: formatNumberToDateString(event.timeEnd, event.date),
      durationEditable: true,
    };
  });

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dateClick={handleSelect}
        headerToolbar={{
          start: 'prev,today,next',
          center: 'timeGridWeek,dayGridMonth,timeGridDay',
          end: '',
        }}
        allDaySlot={false}
        editable={true}
        selectable={true}
        select={handleSelect}
        events={formatDateArray}
      />
    </div>
  );
}
