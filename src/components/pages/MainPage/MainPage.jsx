import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import './MainPage.css';
import Sidebar from '../../libs/Sidebar/Sidebar';
import { signOut } from 'firebase/auth';
import { auth } from '../../../auth/Firebase';
import { Pathname } from '../../../router/Pathname';

export default function MainPage({ user, setAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase sign-out
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
        <div style={{ fontFamily: 'SF Pro Display, sans-serif' }} className='MainP-container'>
            {/* Sidebar on the left */}
            <Sidebar onLogout={handleLogout} />

            {/* Main content area */}
            <div className='MainP-content'>
                <Outlet />  {/* This will render nested routes like /dashboard/information */}
            </div>
        </div>
    )
}
