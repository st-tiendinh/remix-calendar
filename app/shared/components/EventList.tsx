import { Link } from '@remix-run/react';
import { convertDateToString } from '../utils/convertDateString';
import { convertDateToNameDate } from '../utils/date';
import type { EventData } from '../utils/types.server';

interface EventListProps {
  events: EventData[];
}
export default function EventList({ events }: EventListProps) {
  return (
    <ul className="event-list">
      {events
        .sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .map((event: any) => (
          <Link
            key={event.id}
            className="event-link"
            to={`/events/${event.id}`}
          >
            <li key={event.id} className="event-item">
              <div className="event">
                <div className="event-header">
                  <span className="date-name">
                    {convertDateToNameDate(event.date)}
                  </span>
                  <span className="event-date">
                    {convertDateToString(event.date)}
                  </span>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-time">
                  <i className="icon icon-time"></i>
                  <span>
                    {`${event.timeStart} `} - {event.timeEnd}
                  </span>
                </div>
                <p className="event-meeting-link">{event.meetingLink}</p>
              </div>
            </li>
          </Link>
        ))}
    </ul>
  );
}
