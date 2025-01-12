import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import './MainPage.css';
import Sidebar from '../../libs/Sidebar/Sidebar';
import { privateRoutes } from '../../../router/routerConfig';
import { signOut } from 'firebase/auth';
import { auth } from '../../../auth/Firebase';
import { Pathname } from '../../../router/Pathname';
import Information from '../Information/Information';

export default function MainPage({ user, setAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase sign-out
            setAuthenticated(false); // Reset authentication state
            const signupPath = Pathname('SIGNUP'); // Fetch path
            if (signupPath) {
                navigate(signupPath); // Navigate to signup
            } else {
                console.error("Signup path is undefined.");
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
            <Routes>
                    {/* Information Page Route */}
                    <Route
                        path="/information"
                        element={<Information user={user} />}
                    />
                    
                    {/* Other private routes */}
                    {privateRoutes.map((route) => (
                        <Route
                            path={route.path}
                            element={route.element}
                            key={route.path}
                        />
                    ))}
                </Routes>
            </div>
        </div>
    )
}
