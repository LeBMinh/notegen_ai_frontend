import React, { useState, useMemo } from "react";
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
  const [pinnedNotes, setPinnedNotes] = useState([]);

  // Flatten notes from folders
  const notes = folders.flatMap((folder) => folder.notes);

  const handlePinNote = (note) => {
    setPinnedNotes((prevPinnedNotes) => {
      if (prevPinnedNotes.find((pinnedNote) => pinnedNote.id === note.id)) {
        // If already pinned, unpin it
        return prevPinnedNotes.filter((pinnedNote) => pinnedNote.id !== note.id);
      } else {
        // Pin the note
        return [...prevPinnedNotes, note];
      }
    });
  };

  // const filteredNotes = [
  //   ...pinnedNotes.filter(
  //     (note) =>
  //       note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       note.content.toLowerCase().includes(searchTerm.toLowerCase())
  //   ),
  //   ...notes
  //     .filter(
  //       (note) =>
  //         !pinnedNotes.find((pinnedNote) => pinnedNote.id === note.id) && // Exclude pinned notes
  //         (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  //     ),
  // ];

  const filteredNotes = useMemo(() => {
    return [
      ...pinnedNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      ...notes.filter(
        (note) =>
          !pinnedNotes.find((pinnedNote) => pinnedNote.id === note.id) &&
          (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    ];
  }, [searchTerm, pinnedNotes, notes]);
  

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;  // No search term, return original text
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };


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
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note.id} className="dashboard-note-card">
                <span className="dashboard-note-time">
                  <img src={EditTimeAgo} alt="Time Icon" className="dashboard-note-timeAgo-icon" />
                  2 days ago
                </span>
                {/* <img
                  src={Pin}
                  alt="Pin Icon"
                  className="dashboard-note-pin-icon"
                  onClick={() => handlePinNote(note)} // Attach click event
                /> */}
                <div className="dashboard-note-TandC">
                  <h3 className="dashboard-note-title">{note.title}</h3>
                  <p
                    className="dashboard-note-content"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        note.content.length > 70
                          ? `${note.content.slice(0, 70)}...`
                          : note.content,
                        searchTerm
                      ),
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-search-found">
              No notes found for "{searchTerm}"
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
