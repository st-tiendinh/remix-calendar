import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

export default function CalendarWrapper() {
  return <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />;
}
