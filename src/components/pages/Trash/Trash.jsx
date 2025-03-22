import React, { useState, useEffect } from "react";
import './Trash.css';
import { retrieveTrashStorage, recoverFromTrash, clearTrash } from '../../../server/api';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

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
  const [recovering, setRecovering] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // State for MUI Dialog
  const [modalLoading, setModalLoading] = useState(false);

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


  // Recover file or folder from trash
  const handleRecover = async (itemId, folderId) => {
    setRecovering(itemId || folderId); // Show loading only for the recovering item
    try {
      await recoverFromTrash({ itemId, folderId });
      if (itemId) {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== itemId));
      } else {
        setFolders((prevFolders) => prevFolders.filter((folder) => folder._id !== folderId));
      }
    } catch (error) {
      console.error("Error recovering item:", error);
    } finally {
      setRecovering(null);
    }
  };

  const handleClearTrash = async () => {
    setModalLoading(true); // Start loading
    try {
      await clearTrash();
      setNotes([]);
      setFolders([]);
      handleClose(); // Close modal after success
    } catch (error) {
      console.error("Failed to clear trash:", error);
    } finally {
      setModalLoading(false); // Stop loading
      setOpenDialog(false); // Close dialog after clearing
    }
  };

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
            <div className="emptyTrash-container" onClick={() => setOpenDialog(true)} disabled={loading}>
              <img src={TrashBin} alt="TrashBin Icon" className="trash-bin-icon" />
              <p>Empty trash</p>

              {/* {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <>
                  <img src={TrashBin} alt="TrashBin Icon" className="trash-bin-icon" />
                  <p>Empty trash</p>
                </>
              )} */}
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
                    <button
                      className="trash-folder-putBack-btn"
                      onClick={() => handleRecover(null, folder._id)}
                      disabled={recovering === folder._id}
                    >
                      {recovering === folder._id ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <>
                          <img src={PutBack} alt="putBack Icon" className="trash-putBack-icon" />
                          Put back
                        </>
                      )}
                    </button>
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

                  <button
                    className="trash-note-putBack-btn"
                    onClick={() => handleRecover(note._id, null)}
                    disabled={recovering === note._id}
                  >
                    {recovering === note._id ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <>
                        <img src={PutBack} alt="putBack Icon" className="trash-putBack-icon" />
                        Put back
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MUI Confirmation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to permanently delete <strong>{folders.length + notes.length}</strong> items in the trash? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClearTrash} color="error" variant="contained" disabled={modalLoading}>
                {modalLoading ? <CircularProgress size={24} color="inherit" /> : "Yes, Empty Trash"}
              </Button>
            </DialogActions>
          </Dialog>

        </>
      )}
    </div>
  );
}
