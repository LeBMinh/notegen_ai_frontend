import React from 'react';
import './AdminSubscription.css';
// import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';

export default function AdminSubscription() {
  return (
    <div className='adminSubscription-container'>
      <div className='adminSubscription-header'>
        <h2>Subscriptions History</h2>

      </div>

      {/* Confirm transaction bar */}
      <div className="adminSubscription-search-bar">
        <input
          type="text"
          placeholder="Enter transaction id here"
          // value={}
          // onChange={}
          className="adminSubscription-input"
        />
        <button className="search-btn">
          <img src={MagnifyingGlass} alt="Search Icon" className="adminSubscription-seach-icon" />
          Confirm
        </button>
      </div>

      <div className='adminSubscription-filter-cards'>

      </div>

      <div className='adminSubscription-table'>

      </div>

    </div>
  )
}
