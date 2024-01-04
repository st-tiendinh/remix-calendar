import { Link } from '@remix-run/react';
import React from 'react';
import SvgCamera from '~/shared/components/icons/IcCamera';
type CalendarEventProps = {
  isHasMeetingLink: boolean;
  eventTime: string;
  eventTitle: string;
  colorType: string;
  publicId: string;
};

export default React.memo(function CalendarEventBar({
  isHasMeetingLink,
  eventTime,
  eventTitle,
  colorType,
  publicId,
}: CalendarEventProps) {
  return (
    <Link
      to={`/events/${publicId}`}
      prefetch="intent"
      className="custom-event-wrapper"
    >
      <div className="custom-event">
        <div className="custom-event-time-wrapper">
          <span className={`custom-event-time text-${colorType}`}>
            {eventTime}
          </span>
          {isHasMeetingLink && (
            <span className={`custom-event-icon bg-${colorType}`}>
              <SvgCamera />
            </span>
          )}
        </div>
        <div className={`custom-event-title text-${colorType}`}>
          {eventTitle}
        </div>
      </div>
    </Link>
  );
});
