import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import './AdminPage.css';
import AdminSidebar from '../../libs/AdminSidebar/AdminSidebar';
import { Pathname } from '../../../router/Pathname';

export default function AdminPage({ setAuthenticated }) {
    const navigate = useNavigate();

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
        <div style={{ fontFamily: 'SF Pro Display, sans-serif' }} className='MainP-container'>
            {/* Sidebar on the left */}
            <AdminSidebar onLogout={handleLogout} />

            {/* Main content area */}
            <div className='MainP-content'>
                <Outlet />  {/* This will render nested routes for admin */}
            </div>
        </div>
    )
}
