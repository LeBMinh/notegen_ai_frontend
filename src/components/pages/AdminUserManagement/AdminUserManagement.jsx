import React from 'react';
import './AdminUserManagement.css';
import { Drawer } from "@mui/material";

// Import icons
import TotalUserIcon from '../../../assets/Icon_line/UserTime.svg';
import PremiumUserIcon from '../../../assets/Icon_line/AddUser.svg';

export default function AdminUserManagement() {
    return (
        <div className='userManagement-container'>
            <div className='userManagement-header'>
                <h1>Users Management</h1>
            </div>

            <div className='userManagement-filter-cards'>

            </div>

            <div className='userManagement-table'>

            </div>

        </div>
    )
}
