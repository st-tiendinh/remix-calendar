import { Link, Outlet, useLocation, useNavigation } from '@remix-run/react';

import { type EventData } from '../utils/types.server';
import { Spinner } from './Spinner';
import logo from '../../../assets/images/logo.svg';

interface SidebarProps {
  events: EventData[];
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ events, isShow, setIsShow }: SidebarProps) {
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <>
      <div className="sidebar-header">
        <button onClick={() => setIsShow((prev) => !prev)} className="btn">
          <i className="icon icon-list"></i>
        </button>
        <Link className={`${isShow ? null : 'hide'}`} to="/">
          <h1 className="logo">
            <img className="logo-image" src={logo} alt="Fe Calendar logo" />
          </h1>
        </Link>
      </div>
      {navigation.state !== 'idle' &&
      navigation.location?.search.includes('?filter') ? (
        <Spinner />
      ) : (
        <>
          {location.pathname === '/events' ? (
            <>
              <Link
                className={`btn-create ${isShow ? '' : 'sm'} `}
                to="/events/create"
              >
                <i className="icon icon-plus-circle"></i>

                <span className={`btn-create-text ${isShow ? null : 'hide'}`}>
                  CREATE
                </span>
              </Link>

              <div className={`today-event ${isShow ? '' : 'hide'}`}>
                <div className="event-header">
                  <h3 className="event-header-title">Today's Events:</h3>
                  <span className="event-date">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <ul className="event-list">
                  {events.map((event) => (
                    <li key={event.title} className="event-item">
                      <p>
                        <i className="icon icon-active-event"></i>
                      </p>
                      <div className="event-detail">
                        <div className="event-info">
                          <span className="event-time">
                            {event.timeStart} - {event.timeEnd}
                          </span>
                          {event.meetingLink && (
                            <span className="icon-wrapper">
                              <i className="icon icon-camera"></i>
                            </span>
                          )}
                        </div>
                        <h3 className="event-title">{event.title}</h3>
                        <p className="event-meeting-link">
                          {event.meetingLink}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </>
      )}
    </>
  );
}
