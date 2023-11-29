import { Link, useLocation } from '@remix-run/react';
import { formatDate } from '~/shared/utils/convertDateString';
import { ModalAction, ModalType } from '../Modal';

export default function ShowEventDetail({ event }: any) {
  const location = useLocation();

  const handleCopy = () => {
    let copyText =
      document.querySelector<HTMLInputElement>('.event-detail-link');

    if (copyText) {
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);
      let tooltip = document.querySelector<HTMLElement>('#myTooltip');
      if (tooltip) {
        tooltip.innerHTML = 'Copied ' + copyText.value;
      }
    }
  };

  const handleMouseDown = () => {
    let tooltip = document.querySelector<HTMLElement>('myTooltip');
    if (tooltip) {
      tooltip.innerHTML = 'Copy to clipboard';
    }
  };
  return (
    <div className="modal-event-wrapper">
      <div className="modal-event-header">
        {event.author.id && (
          <>
            <Link
              to={`/events/${event.id}/edit`}
              className="btn btn-modal-link"
            >
              <i className="icon icon-pen"></i>
            </Link>
            <Link
              to={`?modal-type=${ModalType.CONFIRM}&modal-action=${ModalAction.DELETE_EVENT}&event-id=${event.id}`}
              className="btn btn-modal-link"
            >
              <i className="icon icon-bin"></i>
            </Link>
          </>
        )}
        <Link to={`${location.pathname}`} className="btn btn-modal-close">
          <i className="icon icon-close"></i>
        </Link>
      </div>
      <div className="event-detail-wrapper">
        <ul className="event-info-list">
          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon vertical-center">
                <i className="icon icon-active"></i>
              </span>
              <div className="event-detail-info">
                <h4 className="event-detail-title">{event.title}</h4>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon vertical-center">
                <i className="icon icon-calendar"></i>
              </span>
              <div className="event-detail-info">
                <div className="event-detail-date-wrapper">
                  <div className="event-detail-date">
                    {formatDate(event.date)}
                  </div>
                  <div className="event-detail-time">
                    <span className="event-detail-timestamp">
                      {event.timeStart}
                    </span>
                    -
                    <span className="event-detail-timestamp">
                      {event.timeEnd}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {event.meetingLink && (
            <li className="event-info-item">
              <div className="event-detail">
                <span className="event-detail-icon vertical-center">
                  <i className="icon icon-meeting-link"></i>
                </span>
                <div className="event-detail-info vertical-center">
                  <input
                    type="text"
                    className="event-detail-link"
                    value={event.meetingLink}
                    onChange={() => {}}
                  />
                </div>
                <div className="tooltip">
                  <button
                    className="btn btn-copy"
                    onClick={handleCopy}
                    onMouseDown={handleMouseDown}
                  >
                    <span className="tooltiptext" id="myTooltip">
                      Copy to clipboard
                    </span>
                    <i className="icon icon-copy"></i>
                  </button>
                </div>
              </div>
            </li>
          )}

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon pt-1">
                <i className="icon icon-desc"></i>
              </span>
              <div className="event-detail-info">
                <p className="event-detail-desc">{event.description}</p>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon vertical-center">
                <i className="icon icon-room"></i>
              </span>
              <div className="event-detail-info">
                <p className="event-detail-location">{event.location}</p>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon vertical-center">
                <i className="icon icon-user"></i>
              </span>
              <div className="event-detail-info">
                <span className="event-detail-desc">
                  {`${event.author.name.firstName} ${event.author.name.lastName}`}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
