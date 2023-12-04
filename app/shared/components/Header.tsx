import { Link } from '@remix-run/react';

import logo from '../../../assets/images/logo.svg';
import SvgList from '~/shared/components/icons/IcList';
import type { UserInfo } from '../utils/types.server';

type HeaderProps = {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo;
};

export default function Header({ setShowSidebar, userInfo }: HeaderProps) {
  const handleShowSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo-group">
          <button
            className="btn btn-toggle-sidebar"
            onClick={handleShowSidebar}
          >
            <SvgList />
          </button>
          <h1 className="logo calendar-logo">
            <Link to={'/'} className="logo-link">
              <img src={logo} alt="FE Calendar Logo" className="logo-image" />
            </Link>
          </h1>
        </div>
        <div className="header-action">
          {/* {userInfo && (
            <span className="header-action-user-info">
              {userInfo.firstName}
              {userInfo.lastName}
            </span>
          )} */}
          <Link
            to={`${userInfo ? '/logout' : '/login'}`}
            className="btn btn-primary"
          >
            {userInfo ? 'Logout' : 'Login'}
          </Link>
        </div>
      </div>
    </header>
  );
}
