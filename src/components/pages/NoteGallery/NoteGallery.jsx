import React, { useState } from "react";
import "./NoteGallery.css";
// import folder and note list
import folders from "../../libs/FolderList/FolderData";
//import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';
import Folder from '../../../assets/Icon_fill/Folder.svg';
import NoteCard from '../../../assets/Icon_fill/UntitledNote.svg';
import FolderTitle from '../../../assets/Icon_line/AddNewFolder.svg';
//import Gradient icons
import LightGradientFolder from '../../../assets/Icon_fill-Gradient/Folder_LGr.svg'

export default function NoteGallery() {
  const [activeFolder, setActiveFolder] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFolderClick = (index) => {
    setActiveFolder(index);
    setActiveNote(null); // Reset active note
    // setSearchTerm(""); // Clear search bar
  };

  const handleNoteClick = (index) => {
    setActiveNote(index === activeNote ? null : index);
  };

  const filteredNotes = folders[activeFolder].notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;  // No search term, return original text
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };

  return (
    <div className="note-gallery-container">
      {/* Search Bar */}
      <div className="noteGallery-search-bar">
        <input
          type="text"
          placeholder="Enter keywords or note name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">
          <img src={MagnifyingGlass} alt="Search Icon" className="noteGallery-seach-icon" />
          Find now
        </button>
      </div>

      <div className="main-gallery-container">
        {/* NoteGallery Folder Cards */}
        <div className="noteGallery-folders-container">
          {folders.map((folder, index) => (
            <div
              key={index}
              className={`noteGallery-folder-card ${activeFolder === index ? "active" : ""
                }`}
              onClick={() => handleFolderClick(index)}
            >
              <img
                src={Folder}
                alt="Folder Icon"
                className="noteGallery-folder-icon"
              />
              <div>
                <div
                  className="noteGallery-folder-title"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      folder.title.length > 30
                        ? `${folder.title.slice(0, 30)}...`
                        : folder.title,
                      searchTerm
                    ),
                  }}
                />
                {/* 'statsNum-container' from Infomation className*/}
                <div className="statsNum-container">
                  <div className="noteGallery-folder-tag">{folder.notes.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Folder full title */}
        <div>
          {folders[activeFolder] && (
            <div className="noteGallery-folder-title-infull">
              <img
                src={FolderTitle}
                alt="Folder Icon"
                className="noteGallery-folder-title-icon"
              />
              <div className="noteGallery-folder-title-full">
                {folders[activeFolder].title}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="notes-gallery-container">
          {filteredNotes.map((note, index) => (
            <div
              key={index}
              className={`noteGallery-note-card ${activeNote === index ? "active" : ""}`}
              onClick={() => handleNoteClick(index)}
            >
              <div className="noteGallery-note-card-container">
                <img src={NoteCard} alt="Note Icon" className="noteGallery-note-icon" />
                <div>
                  <div
                    className="noteGallery-note-title"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(note.title, searchTerm),
                    }}
                  />
                  <div className="noteGallery-note-content">
                    {note.content.length > 50
                      ? `${note.content.slice(0, 50)}...`
                      : note.content}
                  </div>
                </div>
              </div>
              {activeNote === index && (
                <div className="noteGallery-note-preview">
                  <p>{note.content.length > 200
                    ? `${note.content.slice(0, 200)}...`
                    : note.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
