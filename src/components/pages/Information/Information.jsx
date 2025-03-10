import React, { useState, useEffect } from 'react';
import './Information.css';
import { getUserDetails } from '../../../server/api';
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
export default function Information({ user, userId, token }) {

  const resizeAndCropImage = (base64Image, maxWidth = 380, maxHeight = 380) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Calculate aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;
  
        if (width > height) {
          // Landscape
          height = maxHeight;
          width = aspectRatio * maxHeight;
        } else {
          // Portrait or Square
          width = maxWidth;
          height = maxWidth / aspectRatio;
        }
  
        // Set canvas size
        canvas.width = maxWidth;
        canvas.height = maxHeight;
  
        // Center crop and draw image
        ctx.drawImage(img, (width - maxWidth) / -2, (height - maxHeight) / -2, width, height);
  
        resolve(canvas.toDataURL()); // Return new base64 image
      };
    });
  };
  
  if (!user) {
    return <div>No user information available.</div>;
  }
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const storedToken = localStorage.getItem("access_token");

  // console.log(" Stored User:", storedUser);
  // console.log(" Stored Token:", storedToken);

  if (!storedUser.userId || !storedToken) {
    console.error(" Missing userId or token in localStorage");
  }

  const [userNomal, setUserNomal] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Extract first name from the displayName (e.g. "Le Binh Minh (K20 HCM)" to "Le Binh Minh")
  // const firstName = user?.displayName?.split(" ")[0] || "User";
  // const fullName = user.displayName.replace(/\s*\([^)]*\)\s*/g, "").trim();

  useEffect(() => {
    // Use stored values if props are not available
    const finalUserId = userId || storedUser.userId;
    const finalToken = token || storedToken;

      if (!finalUserId || !finalToken) {
      console.error("Missing userId or token before fetching user details");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDetails = await getUserDetails(finalUserId, finalToken);
        // console.log("Fetched user details:", userDetails); // Debugging

        if (!userDetails) {
          console.warn("User details are null or undefined");
        }

        setUserNomal(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  // Debugging logs
  // console.log("User prop:", user);
  // console.log("UserNomal state:", userNomal);

  useEffect(() => {
    if (userNomal?.profile_picture) {
      resizeAndCropImage(userNomal.profile_picture, 380, 380).then((resizedImage) => {
        setUserNomal((prev) => ({ ...prev, profile_picture: resizedImage }));
      });
    }
  }, [userNomal?.profile_picture]);
  

  if (!userNomal) {
    return <div>Loading user information...</div>;
  }

  // Determine user name (Firebase users have `displayName`, normal users may only have `username`)
  const fullName = user?.displayName || userNomal?.username || "User";
  const email = user?.email || userNomal?.email || "No email available";

  // Handle profile image (Firebase users have `photoURL`, `profile_picture` for normal sign-in users / `profileTempo` as a fallback)
  const profileImage =
    userNomal?.profile_picture ||
    (user?.photoURL ? user.photoURL.replace(/=s\d+-c/, "=s380-c") : profileTempo);

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
        {/* <div className="setting-item">
          <span>Edit profile information</span>
        </div> */}
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
