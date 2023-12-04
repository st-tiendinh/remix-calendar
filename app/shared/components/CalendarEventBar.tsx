import React from 'react';
import { EventType } from './CalendarWrapper';
import SvgCamera from '~/shared/components/icons/IcCamera';
type CalendarEventProps = {
  isHasMeetingLink: boolean;
  eventType: EventType;
  eventTime: string;
  eventTitle: string;
};

export default React.memo(function CalendarEventBar({
  isHasMeetingLink,
  eventType,
  eventTime,
  eventTitle,
}: CalendarEventProps) {
  type Color = 'rose' | 'green' | 'blue' | 'amber' | 'violet';

  const EventTypeColor: Record<EventType, Color> = {
    [EventType.BIRTHDAY]: 'rose',
    [EventType.INTERVIEW]: 'amber',
    [EventType.DINING_PARTY]: 'green',
    [EventType.TEAM_MEETING]: 'violet',
    [EventType.OFFLINE_TEAM_MEETING]: 'blue',
  };

  return (
    <div className="custom-event-wrapper">
      <div className="custom-event">
        {isHasMeetingLink && (
          <div className="custom-event-time-wrapper">
            <span
              className={`custom-event-time text-${EventTypeColor[eventType]}`}
            >
              {eventTime}
            </span>
            <span
              className={`custom-event-icon bg-${EventTypeColor[eventType]}`}
            >
              <SvgCamera />
            </span>
          </div>
        )}
        <div className={`custom-event-title text-${EventTypeColor[eventType]}`}>
          {eventTitle}
        </div>
      </div>
    </div>
  );
});
