import { Link } from '@remix-run/react';

import { AdminInfo, type EventData } from '../utils/types.server';

import MiniCalendar from './MiniCalendar';
import SvgPlusCircle from '~/shared/components/icons/IcPlusCircle';
import SvgCamera from '~/shared/components/icons/IcCamera';
import SvgActiveEvent from '~/shared/components/icons/IcActiveEvent';
import { getColor } from '../utils/getColorByAuthorId';
interface SidebarProps {
  todayEvent: EventData[];
  isShow: boolean;
  adminList: AdminInfo[];
  handleChecked: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Sidebar({
  todayEvent,
  isShow,
  adminList,
  handleChecked,
}: SidebarProps) {
  return (
    <aside>
      <div className="sidebar-header">
        <Link
          className={`btn-create ${isShow ? '' : 'sm'} `}
          to="/events/create"
        >
          <SvgPlusCircle />
          <span className={`btn-create-text ${isShow ? null : 'hide'}`}>
            CREATE
          </span>
        </Link>
      </div>

      <div className={`${isShow ? '' : 'hide'}`}>
        <MiniCalendar />
      </div>

      {isShow && (
        <div className="admin-list-checkbox">
          {adminList.map((admin: AdminInfo) => {
            return (
              <>
                <label
                  className={`admin-list-container text-${getColor(admin.id)}`}
                  htmlFor={admin.id}
                >
                  {`${admin.profile.firstName} ${admin.profile.lastName}`}
                  <input
                    className="checkbox"
                    type="checkbox"
                    defaultChecked
                    id={admin.id}
                    value={admin.id}
                    onChange={handleChecked}
                  />
                  <span className="checkmark"></span>
                </label>
              </>
            );
          })}
        </div>
      )}

      <div className={`today-event ${isShow ? '' : 'hide'}`}>
        <div className="event-header">
          <h3 className="event-header-title">Today's Events:</h3>
          <span className="event-date">{new Date().toLocaleDateString()}</span>
        </div>
        <ul className="event-list">
          {todayEvent.map((event) => (
            <li key={event.title} className="event-item">
              <p>
                <SvgActiveEvent />
              </p>
              <div className="event-detail">
                <div className="event-info">
                  <span className="event-time">
                    {event.timeStart} - {event.timeEnd}
                  </span>
                  {event.meetingLink && (
                    <span className="icon-wrapper">
                      <SvgCamera />
                    </span>
                  )}
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-meeting-link">{event.meetingLink}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
