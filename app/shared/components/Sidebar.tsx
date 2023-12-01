import { Link } from '@remix-run/react';

import { type EventData } from '../utils/types.server';

import MiniCalendar from './MiniCalendar';
import logo from '../../../assets/images/logo.svg';
import SvgList from '~/shared/components/icons/IcList';
import SvgPlusCircle from '~/shared/components/icons/IcPlusCircle';
import SvgCamera from '~/shared/components/icons/IcCamera';
import SvgActiveEvent from '~/shared/components/icons/IcActiveEvent';
interface SidebarProps {
  todayEvent: EventData[];
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  todayEvent,
  isShow,
  setIsShow,
}: SidebarProps) {
  return (
    <aside>
      <div className="sidebar-header">
        <button onClick={() => setIsShow((prev) => !prev)} className="btn">
          <SvgList />
        </button>
        <Link className={`${isShow ? null : 'hide'}`} to="/">
          <h1 className="logo">
            <img className="logo-image" src={logo} alt="Fe Calendar logo" />
          </h1>
        </Link>
      </div>

      <>
        <Link
          className={`btn-create ${isShow ? '' : 'sm'} `}
          to="/events/create"
        >
          <SvgPlusCircle />

          <span className={`btn-create-text ${isShow ? null : 'hide'}`}>
            CREATE
          </span>
        </Link>
        <div className={`${isShow ? '' : 'hide'}`}>
          <MiniCalendar />
        </div>

        <div className={`today-event ${isShow ? '' : 'hide'}`}>
          <div className="event-header">
            <h3 className="event-header-title">Today's Events:</h3>
            <span className="event-date">
              {new Date().toLocaleDateString()}
            </span>
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
      </>
    </aside>
  );
}
