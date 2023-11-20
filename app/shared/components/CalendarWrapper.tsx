import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarWrapper() {
  const handleSelect = (info: any) => {};
  
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
        events={[
          {
            title: 'Play video game',
            start: '2023-11-11T10:00:00',
            end: '2023-11-11T12:00:00',
            durationEditable: true
          },
        ]}
      />
    </div>
  );
}
