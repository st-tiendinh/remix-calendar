import React from 'react';
import SvgCamera from '~/shared/components/icons/IcCamera';
type CalendarEventProps = {
  isHasMeetingLink: boolean;
  eventTime: string;
  eventTitle: string;
  colorType: string;
};

export default React.memo(function CalendarEventBar({
  isHasMeetingLink,
  eventTime,
  eventTitle,
  colorType,
}: CalendarEventProps) {
  return (
    <div className="custom-event-wrapper">
      <div className="custom-event">
        {isHasMeetingLink && (
          <div className="custom-event-time-wrapper">
            <span className={`custom-event-time text-${colorType}`}>
              {eventTime}
            </span>
            <span className={`custom-event-icon bg-${colorType}`}>
              <SvgCamera />
            </span>
          </div>
        )}
        <div className={`custom-event-title text-${colorType}`}>
          {eventTitle}
        </div>
      </div>
    </div>
  );
});
