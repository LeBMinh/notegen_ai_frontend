import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';
import { Pathname } from '../../../router/Pathname';

// Importing icons
import FullLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import Logo from '../../../assets/Logo/Icon_NG-Logo.svg';
import AdminDashboardIcon from '../../../assets/Icon_fill/UnlimitedWord.svg';
import UsersIcon from '../../../assets/Icon_fill/Information.svg';
import SubscriptionIcon from '../../../assets/Icon_fill/SubscribeNow.svg';
import LogoutIcon from '../../../assets/Icon_fill/LogOut.svg';

// Importing active gradient icons
import ActiveAdminDashboardIcon from '../../../assets/Icon_fill-sidebarGradient/UnlimitedWord.svg';
import ActiveUsersIcon from '../../../assets/Icon_fill-sidebarGradient/Information.svg';
import ActiveSubscribeIcon from '../../../assets/Icon_fill-Gradient/SubscribeNow.svg';


export default function AdminSidebar({ onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Define links for the sidebar
  const topLinks = [
    { path: Pathname('ADMIN_DASHBOARD'), label: 'Dashboard', defaultIcon: AdminDashboardIcon, activeIcon: ActiveAdminDashboardIcon },
    { path: Pathname('ADMIN_USERMANGEMENT'), label: 'User Management', defaultIcon: UsersIcon, activeIcon: ActiveUsersIcon },
    { path: Pathname('ADMIN_SUBSCRIPTION'), label: 'Subscriptions', defaultIcon: SubscriptionIcon, activeIcon: ActiveSubscribeIcon },
  ];

  const bottomLinks = [
    { label: 'Logout', onClick: onLogout, defaultIcon: LogoutIcon },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>

      <div className="logo-container">
        {isCollapsed ? (
          <img src={Logo} alt="Logo" className="sole-logo" />
        ) : (
          <img src={FullLogo} alt="Full Logo" className="full-logo" />
        )}
      </div>

      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? '⟩' : '⟨'}
      </button>

      <div className="links-container">
        {/* Top section */}
        <div className="top-links">
          {topLinks
            .map((link) => (
              <NavLink
                to={link.path}
                className='sidebar-link'
                key={link.label}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? link.activeIcon : link.defaultIcon}
                      alt={`${link.label} Icon`}
                      className="icon"
                    />
                    {!isCollapsed && <span className="label-style">{link.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
        </div>

        {/* Bottom section */}
        <div className="bottom-links">
          {bottomLinks
            .map((link, index) => (
              link.path ? (
                <NavLink
                  to={link.path}
                  className='sidebar-link'
                  key={index}
                >
                  {({ isActive }) => (
                    <>
                      <img
                        src={isActive ? link.activeIcon : link.defaultIcon}
                        alt={`${link.label} Icon`}
                        className="icon"
                      />
                      {!isCollapsed && <span className="label-style">{link.label}</span>}
                    </>
                  )}
                </NavLink>
              ) : (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="sidebar-link logoutBtn-style"
                >
                  <img src={link.defaultIcon} alt={`${link.label} Icon`} className="icon" />
                  {!isCollapsed && <span className="label-style">{link.label}</span>}
                </button>
              )
            ))}
        </div>
      </div>
    </div>
  )
}
