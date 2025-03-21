import React, { useState, useEffect } from "react";
import './Trash.css';
import { retrieveTrashStorage } from '../../../server/api';
import CircularProgress from "@mui/material/CircularProgress";

// import images & icons
import Trash_3D from '../../../assets/Stock3D-png/Trash.png';
import Folder from '../../../assets/Icon_fill/Folder.svg';
import Note from '../../../assets/Icon_fill/UntitledNote.svg';
import RecentlyNote from '../../../assets/Icon_fill/RecentlyNote.svg';
import TrashBin from '../../../assets/Icon_line/TrashBin.svg';
import PutBack from '../../../assets/Icon_line/Undo-MoveBack.svg';

export default function Trash() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all trash data
  const fetchTrashData = async () => {
    setLoading(true);
    try {
      await fetchNotes();
      await fetchFolders();
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes from trash
  const fetchNotes = async () => {
    try {
      const response = await retrieveTrashStorage();
      console.log("Raw API Response (Notes):", response);

      if (!response || !response.body || !Array.isArray(response.body.data)) {
        console.error("Unexpected API response format", response);
        return;
      }

      const data = response.body.data;
      const filteredNotes = data.filter(
        (item) => item.type === "file" && item.is_deleted
      );
      setNotes(filteredNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch folders from trash
  const fetchFolders = async () => {
    try {
      const response = await retrieveTrashStorage(); // ✅ Fixed function call
      console.log("Raw API Response (Folders):", response);

      if (!response || !response.body || !Array.isArray(response.body.data)) {
        console.error("Unexpected API response format", response);
        return;
      }

      const data = response.body.data;
      const filteredFolders = data.filter(
        (item) => item.type === "folder" && item.is_deleted
      );
      setFolders(filteredFolders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchTrashData(); // Fetch all trash data on mount
  }, []);

  return (
    <div className='trashContainer'>
      {loading ? (
        <div className="trash-loading-container">
          <CircularProgress size={40} />
        </div>
      ) : (folders.length === 0 && notes.length === 0) ? (
        <div className="noFile-content">
          <img
            src={Trash_3D}
            alt="Trash_3D Icon"
            className="trash3D-icon"
          />
          <p className='trashZero'>Trash (0)</p>
          <p className='noFileTrash'>Nothing here</p>
        </div>
      ) : (
        <>
          {/* Trash title and Empty trash button */}
          <div className="trash-header">
            <div className="trash-header-left">
              <p className='trashZero'>Trash ({folders.length + notes.length})</p>
              <p className="trash-header-note">Notes and Folders in Trash will be permanently deleted after 30 days</p>
            </div>
            <div className="emptyTrash-container">
              <img src={TrashBin} alt="TrashBin Icon" className="trash-bin-icon" />
              <p>Empty trash</p>
            </div>
          </div>

          {/* Recent delete para */}
          <div className="dashboard-recent-note-container">
            <img
              src={RecentlyNote}
              alt="RecentlyNote Icon"
              className="dashboard-recent-note-icon"
            />
            <div className="dashboard-recent-note-title">
              Recently deleted
            </div>
          </div>

          {/* Folders in trash */}
          <div className="trash-folder-container">
            {folders.map(folder => (
              <div key={folder._id} className="trash-folder-card">
                <div className="trash-folder-card-container">
                  <div className="trash-folder-header-card">
                    <div className="trash-folder-timestamp">
                      {new Date(folder.deleted_at).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="trash-folder-putBack-btn">
                      <img src={PutBack} alt="putBack Icon" className="trash-putBack-icon" />
                      Put back
                    </div>
                  </div>

                  <div className="trash-folder-content">
                    <img src={Folder} alt="Folder Icon" className="trash-folder-icon" />
                    <div className="trash-folder-title">
                      {folder.name.length > 50 ||
                        folder.name.length === 0
                        ? `${folder.name.slice(0, 50)}...`
                        : folder.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes in trash */}
          <div className="trash-note-container">
            {notes.map(note => (
              <div key={note._id} className="trash-note-card">
                <div className="trash-note-card-container">
                  <div className="trash-note-card-left">
                    <div className="trash-folder-timestamp">
                      {new Date(note.deleted_at).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </div>

                    <div className="trash-note-card-content">
                      <img src={Note} alt="Note Icon" className="trash-note-icon" />
                      <div>
                        <div className="trash-note-title">{note.name}</div>
                        <div className="trash-note-content">
                          {note.content.original.replace(/<\/?[^>]+(>|$)/g, "").length > 50 ||
                            note.content.original.replace(/<\/?[^>]+(>|$)/g, "").length === 0
                            ? `${note.content.original.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 50)}...`
                            : note.content.original.replace(/<\/?[^>]+(>|$)/g, "")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="trash-note-putBack-btn">
                    <img src={PutBack} alt="putBack Icon" className="trash-putBack-icon" />
                    Put back
                  </div>
                </div>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}
