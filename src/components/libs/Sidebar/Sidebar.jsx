import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../auth/Firebase';
import './Sidebar.css';
import { createFile } from '../../../server/api';
import { PATH_NAME, Pathname } from '../../../router/Pathname';
import { publicRoutes } from '../../../router/routerConfig';
import DBoardModals from '../DBoardModals/DBoardModals';

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

export default function Sidebar({ onLogout }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const openModal = () => {
        console.log("Opening modal...");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("Closing modal...");
        setIsModalOpen(false);
    };

    // Define links for the sidebar
    const topLinks = [
        // Official Grab-Your-Note Path here
        { label: 'Grab Your Note', defaultIcon: GrabYourNoteIcon },
        { path: Pathname('DASHBOARD'), label: 'Dashboard', defaultIcon: DashboardIcon, activeIcon: ActiveDashboardIcon },
        { path: Pathname('NOTE_GALLERY'), label: 'Note Gallery', defaultIcon: NoteGalleryIcon, activeIcon: ActiveNoteGalleryIcon },
        { path: Pathname('SMART_LEARNING'), label: 'Smart Learning', defaultIcon: SmartLearningIcon, activeIcon: ActiveSmartLearningIcon },
        { path: Pathname('INFORMATION'), label: 'Information', defaultIcon: InformationIcon, activeIcon: ActiveInformationIcon },
        { path: Pathname('TRASH'), label: 'Trash', defaultIcon: TrashIcon, activeIcon: ActiveTrashIcon },
    ];

    const bottomLinks = [
        { path: Pathname('SUBSCRIPTION_NOW'), label: 'Subscription Now', defaultIcon: SubscriptionIcon },
        { path: Pathname('HELP_CENTER'), label: 'Help Center', defaultIcon: HelpIcon, activeIcon: ActiveHelpIcon },
        { label: 'Logout', onClick: onLogout, defaultIcon: LogoutIcon },
    ];

    const handleNavigateToCanvas = async () => {
        try {
          const fileName = "Untitled note";
          const folderId = null; // No folder selected (BE will assign a default folder)
      
          // Create the file using the modified API function
          const response = await createFile(folderId, fileName);
      
          // Extract the correct file ID from the API response
          const fileId = response?.body?.data?._id;
      
          if (fileId) {
            console.log("New file created with ID:", fileId);
            navigate(`/notecanvas/${fileId}`);
            setIsModalOpen(false);
          } else {
            console.error("File creation failed: No ID returned.");
          }
        } catch (error) {
          console.error("Error creating new file:", error);
        }
      };   

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
                        <button onClick={openModal} className="sidebar-link custom-top-link">
                            <img src={GrabYourNoteIcon} alt="Grab Your Note Icon" className="icon" />
                            {!isCollapsed && <span className="label-style GrabYourNote-text">Grab Your Note</span>}
                        </button>
                    </div>

                    {/* Other top links */}
                    {topLinks
                        .filter(link => link.label !== 'Grab Your Note')
                        .map((link) => (
                            <NavLink
                                to={link.path}
                                className='sidebar-link'
                                // activeClassName="active"
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
                    {/* Render the modal */}
                    {isModalOpen && <DBoardModals openMD={isModalOpen} onClose={closeModal} onNavigateToCanvas={handleNavigateToCanvas} />}
                </div>

                {/* Bottom section */}
                <div className="bottom-links">
                    {/* Separate Subscription Now link */}
                    <div className="subscription-link">
                        <NavLink
                            to={PATH_NAME.SUBSCRIPTION_NOW}
                            className="sidebar-link custom-link"
                        // activeClassName="active"
                        >
                            <div className="icon" />
                            {!isCollapsed && <span className="label-style">Subscription <br /> Now!</span>}
                        </NavLink>
                    </div>

                    {/* Map through other links */}
                    {bottomLinks
                        .filter(link => link.label !== 'Subscription Now')
                        .map((link, index) => (
                            link.path ? (
                                <NavLink
                                    to={link.path}
                                    className='sidebar-link'
                                    // className={`sidebar-link ${link.label === 'Subscription Now' ? 'custom-link' : ''}`}
                                    // activeClassName="active"
                                    key={index}
                                // onClick={link.onClick || undefined} 
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
    );
}
