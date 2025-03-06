import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './StartPage.css';
import { Pathname, PATH_NAME } from '../../../router/Pathname';

import FullLogo from '../../../assets/Logo/Full_NG-Logo.svg';
import ToDashboardIcon from '../../../assets/Icon_fill/SkipForNow.svg';
import LogoutIcon from '../../../assets/Icon_fill/LogOut.svg';

export default function StartPage({ setAuthenticated }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from local storage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Stored User:", storedUser); // Debugging

        if (!storedUser) {
            navigate(PATH_NAME.SIGNIN); // Redirect if no user found
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleNavigateToDashboard = () => {
        if (user?.isAdmin) {
            navigate(PATH_NAME.ADMIN_DASHBOARD);
        } else {
            navigate(PATH_NAME.DASHBOARD);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setAuthenticated(false); // Reset authentication state
            // setUser(null);
            const signinPath = Pathname('SIGNIN'); // Fetch path
            if (signinPath) {
                navigate(signinPath); // Navigate to signin
            } else {
                console.error("Signin path is undefined.");
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className='startPage-container'>
            <div className='startPage-header'>
                You are already logged in to
                <img src={FullLogo} alt="FullLogo Icon" className="startPage-fullLogo-icon" />
            </div>
            <div className='startPage-btn-container'>
                <button onClick={handleNavigateToDashboard} className='startPage-btn toDashboardBtn'>
                    Go to Dashboard
                    <img src={ToDashboardIcon} alt="ToDashboard Icon" className="startPage-toDashboard-icon" />
                </button>
                <button onClick={handleLogout} className='startPage-btn logoutBtn'>
                    <img src={LogoutIcon} alt="ToDashboard Icon" className="startPage-logout-icon" />
                    Log out
                </button>
            </div>
        </div>
    )
}
