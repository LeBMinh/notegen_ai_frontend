import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { PATH_NAME, Pathname } from '../../../router/Pathname';

// Importing icons
import FullLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import Logo from '../../../assets/Logo/Icon_NG-Logo.svg';
import GrabYourNoteIcon from '../../../assets/Icon_line/GrabYourNote.svg';
import DashboardIcon from '../../../assets/Icon_fill/Dashboard.svg';
import NoteGalleryIcon from '../../../assets/Icon_fill/NoteGallery.svg';
import SmartLearningIcon from '../../../assets/Icon_fill/SmartLearning.svg';
import InformationIcon from '../../../assets/Icon_fill/Information.svg';
import TrashIcon from '../../../assets/Icon_fill/Trash.svg';
import SubscriptionIcon from '../../../assets/Icon_fill/SubscribeNow.svg';
import HelpIcon from '../../../assets/Icon_fill/NeedHelp.svg';
import LogoutIcon from '../../../assets/Icon_fill/LogOut.svg';

// Importing active gradient icons
import ActiveDashboardIcon from '../../../assets/Icon_fill-sidebarGradient/Dashboard.svg';
import ActiveNoteGalleryIcon from '../../../assets/Icon_fill-sidebarGradient/NoteGallery.svg';
import ActiveSmartLearningIcon from '../../../assets/Icon_fill-sidebarGradient/SmartLearning.svg';
import ActiveInformationIcon from '../../../assets/Icon_fill-sidebarGradient/Information.svg';
import ActiveTrashIcon from '../../../assets/Icon_fill-sidebarGradient/Trash.svg';
import ActiveHelpIcon from '../../../assets/Icon_fill-sidebarGradient/NeedHelp.svg';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Define links for the sidebar
    const topLinks = [
        // Official Grab-Your-Note Path here
        { path: Pathname('GRAB_YOUR_NOTE'), label: 'Grab Your Note', defaultIcon: GrabYourNoteIcon },
        { path: Pathname('DASHBOARD'), label: 'Dashboard', defaultIcon: DashboardIcon, activeIcon: ActiveDashboardIcon },
        { path: Pathname('NOTE_GALLERY'), label: 'Note Gallery', defaultIcon: NoteGalleryIcon, activeIcon: ActiveNoteGalleryIcon },
        { path: Pathname('SMART_LEARNING'), label: 'Smart Learning', defaultIcon: SmartLearningIcon, activeIcon: ActiveSmartLearningIcon },
        { path: Pathname('INFORMATION'), label: 'Information', defaultIcon: InformationIcon, activeIcon: ActiveInformationIcon },
        { path: Pathname('TRASH'), label: 'Trash', defaultIcon: TrashIcon, activeIcon: ActiveTrashIcon },
    ];

    const bottomLinks = [
        { path: Pathname('SUBSCRIPTION_NOW'), label: 'Subscription Now', defaultIcon: SubscriptionIcon },
        { path: Pathname('HELP_CENTER'), label: 'Help Center', defaultIcon: HelpIcon, activeIcon: ActiveHelpIcon },
        { path: Pathname('LOGOUT'), label: 'Logout', defaultIcon: LogoutIcon },
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
                {/* Grab Your Note link button*/}
                <div className="GrabYourNote-link">
                    <NavLink
                        to={PATH_NAME.GRAB_YOUR_NOTE}
                        className='sidebar-link custom-top-link'
                        activeClassName="active"
                    >
                        <img
                                src={GrabYourNoteIcon}
                                alt="GrabYourNote Icon"
                                className="icon"
                            />
                        {!isCollapsed && <span className="label-style GrabYourNote-text">Grab Your Note</span>}
                    </NavLink>
                </div>
                
                {/* Other top links */}
                    {topLinks
                        .filter(link => link.label !== 'Grab Your Note')
                        .map((link) => (
                            <NavLink
                                to={link.path}
                                className='sidebar-link'
                                activeClassName="active"
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
                    {/* Separate Subscription Now link */}
                    <div className="subscription-link">
                        <NavLink
                            to={PATH_NAME.SUBSCRIPTION_NOW}
                            className="sidebar-link custom-link"
                            activeClassName="active"
                        >
                            <div className="icon" />
                            {!isCollapsed && <span className="label-style">Subscription Now!</span>}
                        </NavLink>
                    </div>

                    {/* Map through other links */}
                    {bottomLinks
                        .filter(link => link.label !== 'Subscription Now')
                        .map((link) => (
                            <NavLink
                                to={link.path}
                                className='sidebar-link'
                                // className={`sidebar-link ${link.label === 'Subscription Now' ? 'custom-link' : ''}`}
                                activeClassName="active"
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
            </div>
        </div>
    );
}
