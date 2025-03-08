import React, { useEffect, useState } from 'react';
import './AdminUserManagement.css';
import { Drawer } from "@mui/material";
import { getAllUsers } from '../../../server/api';

// Import icons
import TotalUserIcon from '../../../assets/Icon_line/UserTime.svg';
import PremiumUserIcon from '../../../assets/Icon_line/AddUser.svg';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersData = await getAllUsers();
                console.log("Fetched users in AdminUserManagement:", usersData); // Debugging
    
                if (Array.isArray(usersData) && usersData.length > 0) {
                    setUsers(usersData);
                } else {
                    console.warn("Users data is empty or undefined.");
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);    


    return (
        <div className='userManagement-container'>
            <div className='userManagement-header'>
                <h2>Users Management</h2>
            </div>

            <div className='userManagement-filter-cards'>

            </div>

            <div className='userManagement-table'>
                {loading ? (
                    <p>Loading...</p>
                ) : users?.length > 0 ? (
                    <ul>
                        {users.map((user) => (
                            <li key={user._id}>
                                {user.username} - {user.email} {user.isAdmin ? "(Admin)" : ""}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found.</p>
                )}
            </div>

        </div>
    )
}
