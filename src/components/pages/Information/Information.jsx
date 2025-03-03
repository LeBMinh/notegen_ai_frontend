import React, { useState } from 'react';
import './Information.css';
// import frame and replacement profile
import profileFrame from '../../../assets/Others/profile-Frame.png'
import profileFrameExpanded from '../../../assets/Others/profileFrame.png'
import profileTempo from '../../../assets/Others/tmepo-Profile-380x380.png'
//import icons
import Folder from '../../../assets/Icon_fill/Folder.svg'
import UntitledNote from '../../../assets/Icon_fill/UntitledNote.svg'
//import Gradient icons
import LightGradientFolder from '../../../assets/Icon_fill-Gradient/Folder_LGr.svg'
import DarkGradientFolder from '../../../assets/Icon_fill-Gradient/Folder_DGr.svg'
export default function Information({ user }) {
  if (!user) {
    return <div>No user information available.</div>;
  }

  const [isHovered, setIsHovered] = useState(false);

  // Extract first name from the displayName (e.g. "Le Binh Minh (K20 HCM)" to "Le Binh Minh")
  // const firstName = user?.displayName?.split(" ")[0] || "User";
  // const fullName = user.displayName.replace(/\s*\([^)]*\)\s*/g, "").trim();

   // Determine user name (Firebase users have `displayName`, normal users may only have `username`)
   const fullName = user.displayName || user.username || "User";
   const email = user.email || "No email available";
   
   // Handle profile image (Firebase users have `photoURL`, `profile_picture` for normal sign-in users / `profileTempo` as a fallback)
   const profileImage = 
   user.profile_picture || 
   (user.photoURL ? user.photoURL.replace(/=s\d+-c/, "=s380-c") : profileTempo);

  return (
    <div className='profileContainer'>
      {/* Numbers of Notes and Folders */}
      <div className="profile-stats">
        <div className="stats-item card">
          <img
            src={LightGradientFolder}
            alt={'Folder Icon'}
            className="stats-icon DG_folder-icon"
          />
          <p style={{ fontSize: '16px', marginLeft: '2px', fontWeight: '700' }}>Number of folders</p>
          <div className="statsNum-container">
            <div className="stats-number">12</div>
          </div>
        </div>

        <div className="stats-item card">
          <img
            src={UntitledNote}
            alt={'UntitledNote Icon'}
            className="stats-icon UNote-icon"
          />
          <p style={{ fontSize: '16px', marginLeft: '2px', fontWeight: '700' }}>Number of notes</p>
          <div className="statsNum-container">
            <div className="stats-number">42</div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className='profileInfo'>
        {/* Profile Picture Section */}
        <div className='profilePic-container'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={profileFrame}
            alt="Profile Frame"
            className={`profile-frame ${isHovered ? "hidden-frame" : ""}`}
          />
          <img
            src={profileFrameExpanded}
            alt="Profile Frame Expanded"
            className={`profile-frame ${isHovered ? "visible-frame" : "hidden-frame"}`}
          />
          <img
            src={profileFrameExpanded}
            alt="Profile Frame"
            className="profile-frame"
          />
          <img
            src={profileImage}
            alt="User Profile"
            className="userProfile-pic"
            onError={(e) => (e.target.src = profileTempo)} // Fallback image
          />
        </div>
        {/* Profile Info Form Section */}
        <div className="profile-form">
          <div className="form-row">
            <div className="floating-label">
              <input type="text" value={fullName} readOnly />
              <label>Full Name</label>
            </div>
          </div>

          <div className="form-row">
            <div className="floating-label">
              <input type="text" value={email} readOnly />
              <label>Email</label>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="profile-settings">
        <div className="setting-item">
          <span>Edit profile information</span>
        </div>
        <div className="setting-item">
          <span>Notifications</span>
          <span className="notifications-toggle">ON</span>
        </div>
        <div className="setting-item">
          <span>Language</span>
          <span>English</span>
        </div>
      </div>
    </div>
  )
}
