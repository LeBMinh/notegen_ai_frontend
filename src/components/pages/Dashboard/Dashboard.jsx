import React, { useState } from "react";
import './Dashboard.css';
// import folder and note list
import folders from "../../libs/FolderList/FolderData";
//import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';
import RecentlyNote from '../../../assets/Icon_fill/RecentlyNote.svg';
import EditTimeAgo from '../../../assets/Icon_line/EditTimeAgo.svg';
import Pin from '../../../assets/Icon_fill/Pin.svg';
//import Gradient icons
import DkGradientSparkle from '../../../assets/Icon_line-Gradient/FindYourOwnNote_DGr.svg'
import LgGradientNoteNow from '../../../assets/Icon_line-Gradient/GrabYourNote_LGr.svg'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Flatten notes from folders
  const notes = folders.flatMap((folder) => folder.notes);

  return (
    <div className='dashboard-container'>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <img
          src={DkGradientSparkle}
          alt={'Sparkle Icon'}
          className="dashboard-sparkle-icon"
        />
        <h1 className='dashboard-title'>FIND YOUR OWN NOTE</h1>
        <img
          src={DkGradientSparkle}
          alt={'Sparkle Icon'}
          className="dashboard-sparkle-icon"
        />
      </div>

      {/* Dashboard Search bar */}
      <div className="dashboard-search-bar">
        <input
          type="text"
          placeholder="Enter keywords or note name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">
          <img src={MagnifyingGlass} alt="Search Icon" className="dashboard-seach-icon" />
          Find now
        </button>
      </div>

      {/* Dashboard Take Note Now board */}
      <div className="dashboard-takeNote-board">
        <div className="dashboard-content-board">
          <img
            src={LgGradientNoteNow}
            alt={'NoteNow Icon'}
            className="dashboard-NoteNow-icon"
          />
          <p className='takeNote-title-board'>Take note now</p>
          <p className='takeNote-des-board'>
            Unlock your potential by turning your notes into action.<br />
            Every note is a step toward mastering your goals!"</p>
        </div>
      </div>

      {/* Dashboard Note List */}
      <div className="dashboard-note-list">
        <div className="dashboard-recent-note-container">
          <img
            src={RecentlyNote}
            alt="RecentlyNote Icon"
            className="dashboard-recent-note-icon"
          />
          <div className="dashboard-recent-note-title">
            Recently note
          </div>
        </div>

        {/* Note List */}
        <div className="dashboard-note-cards-container">
          {notes.map((note) => (
            <div key={note.id} className="dashboard-note-card">
              <span className="dashboard-note-time">
                <img src={EditTimeAgo} alt="Time Icon" className="dashboard-note-timeAgo-icon"/>
                 2 days ago
              </span>
              <img src={Pin} alt="Pin Icon" className="dashboard-note-pin-icon" />
              <div className="dashboard-note-TandC">
                <h3 className="dashboard-note-title">{note.title}</h3>
                <p className="dashboard-note-content">
                  {note.content.length > 70 ? `${note.content.slice(0, 70)}...` : note.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
