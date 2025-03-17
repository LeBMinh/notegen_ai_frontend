import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NoteGallery.css";
import { retrieveStorage, moveFile, renameItem, deleteItem } from '../../../server/api';
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

//import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';
import Folder from '../../../assets/Icon_fill/Folder.svg';
import NoteCard from '../../../assets/Icon_fill/UntitledNote.svg';
import FolderTitle from '../../../assets/Icon_line/AddNewFolder.svg';
//import Gradient icons
import LightGradientFolder from '../../../assets/Icon_fill-Gradient/Folder_LGr.svg'

export default function NoteGallery() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRename, setLoadingRename] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  // Fetch storage data
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await retrieveStorage();
      console.log("Raw API Response:", response); // Debugging

      if (!response || !response.body || !Array.isArray(response.body.data)) {
        console.error("Error: Unexpected API response format", response);
        return;
      }

      const data = response.body.data;

      if (!Array.isArray(data)) {
        console.error("Error: API did not return an array. Received:", data);
        return;
      }

      const filteredNotes = data.filter(
        (note) => note.type === "file" && !note.is_deleted
      );

      // console.log("Filtered Notes:", filteredNotes); // Debugging
      setNotes(filteredNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on mount
  }, []);

  // Fetch folders separately (not part of fetchNotes)
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await retrieveStorage();
      console.log("Raw API Response:", response); // Debugging

      if (!response || !response.body || !Array.isArray(response.body.data)) {
        console.error("Error: Unexpected API response format", response);
        return;
      }

      const data = response.body.data;

      if (!Array.isArray(data)) {
        console.error("Error: API did not return an array. Received:", data);
        return;
      }

      const filteredFolders = data.filter(
        (item) => item.type === "folder" && !item.is_deleted
      );

      // console.log("Filtered Notes:", filteredFolders ); // Debugging
      setFolders(filteredFolders);

      if (filteredFolders.length > 0) {
        setActiveFolder(filteredFolders[0]._id);
      }

    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchFolders(); // Fetch notes on mount
  }, []);

  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
    // setSearchTerm(""); // Clear search bar
  };

  const handleNoteToCanvas = (file_id) => {
    if (file_id) {
      navigate(`/notecanvas/${file_id}`);
    } else {
      console.error("Invalid file_id:", file_id);
    }
  };

  // Filter notes belonging to the active folder
  const filteredNotes = notes.filter((note) => note.folder_id === activeFolder &&
    note.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getFolderDisplayName = (folderName) => {
    return folderName === "Main" ? "NoteGen Folder" : folderName;
  };

  const handleRightClick = (event, item, type) => {
    event.preventDefault(); // Prevent default right-click behavior

    console.log("Right-click detected on:", item);
    console.log("Item type:", type);

    setContextMenu({ x: event.clientX, y: event.clientY, type });

    // Ensure correct ID mapping for notes and folders
    const selectedData = {
      ...item,
      item_id: type === "file" ? item._id : null,
      folder_id: type === "folder" ? item._id : null,
      name: item.name,
    };

    console.log("Selected Item Data:", selectedData);
    console.log("Selected Item Data:", selectedData._id);
    console.log("Selected Item Data:", selectedData.name);
    console.log("Selected Item Data:", selectedData.item_id);
    console.log("Selected Item Data:", selectedData.folder_id);

    setSelectedItem(selectedData);
  };


  const closeMenu = () => {
    setContextMenu(null);
    setSelectedItem(null);
  };

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  // Open rename dialog
  const openRenameDialog = (item) => {
    if (!item) return; // Prevent opening dialog with null item

    console.log("Renaming item:", item);
    setSelectedItem(item);
    setRenameInput(item.name);
    setRenameDialogOpen(true);
  };

  // Handle renaming
  const handleRenameConfirm = async () => {
    if (!selectedItem || !renameInput.trim()) return;

    console.log("Renaming item:", selectedItem);
    console.log("New name:", renameInput);

    setLoadingRename(true);
    try {
      await renameItem(
        selectedItem.item_id || null,
        selectedItem.folder_id || null,
        renameInput
      );
      console.log("Rename successful");

      setRenameDialogOpen(false);
      closeMenu();

      if (selectedItem.item_id) {
        await fetchNotes(); // If it's a note, fetch updated notes
      } else if (selectedItem.folder_id) {
        await fetchFolders(); // If it's a folder, fetch updated folders
      }
    } catch (error) {
      console.error("Rename failed:", error);
    } finally {
      setLoadingRename(false);
    }
  };


  // Open delete dialog
  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    console.log("Deleting item:", selectedItem);
    setLoadingDelete(true);

    try {
      await deleteItem(
        selectedItem.item_id || null,
        selectedItem.folder_id || null
      );
      console.log("Delete successful");

      setDeleteDialogOpen(false);
      closeMenu();
      if (selectedItem.item_id) {
        await fetchNotes(); // If deleting a note, refresh notes
      } else if (selectedItem.folder_id) {
        await fetchFolders(); // If deleting a folder, refresh folders
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoadingDelete(false);
    }
  };


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
          {folders.map((folder) => (
            <div
              key={folder._id}
              className={`noteGallery-folder-card ${activeFolder === folder._id ? "active" : ""}`}
              onClick={() => handleFolderClick(folder._id)}
              onContextMenu={(event) => handleRightClick(event, folder, "folder")}
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
                      getFolderDisplayName(folder.name).length > 30
                        ? `${getFolderDisplayName(folder.name).slice(0, 30)}...`
                        : getFolderDisplayName(folder.name),
                      searchTerm
                    ),
                  }}
                />
                {/* 'statsNum-container' from Infomation className*/}
                <div className="statsNum-container">
                  <div className="noteGallery-folder-tag">
                    {notes.filter(note => note.folder_id === folder._id).length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Folder Title */}
        <div>
          {activeFolder && (
            <div className="noteGallery-folder-title-infull">
              <img
                src={FolderTitle}
                alt="Folder Icon"
                className="noteGallery-folder-title-icon"
              />
              <div className="noteGallery-folder-title-full">
                {getFolderDisplayName(
                  folders.find((folder) => folder._id === activeFolder)?.name || ""
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes List*/}
        <div className="notes-gallery-container">
          {loading ? (
            <div className="notes-gallery-loading-container">
              <CircularProgress size={40} />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="notes-gallery-no-notes-message">No note? Go create some 📑</div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note._id}
                className="noteGallery-note-card"
                onClick={() => handleNoteToCanvas(note._id)}
                onContextMenu={(event) => handleRightClick(event, note, "file")}
              >
                <div className="noteGallery-note-card-container">
                  <img src={NoteCard} alt="Note Icon" className="noteGallery-note-icon" />
                  <div>
                    <div
                      className="noteGallery-note-title"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(note.name, searchTerm),
                      }}
                    />
                    <div className="noteGallery-note-content">
                      {note.content.original.replace(/<\/?[^>]+(>|$)/g, "").length > 50 ||
                        note.content.original.replace(/<\/?[^>]+(>|$)/g, "").length === 0
                        ? `${note.content.original.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 50)}...`
                        : note.content.original.replace(/<\/?[^>]+(>|$)/g, "")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Click Context Menu */}
        {contextMenu && (
          <ul ref={menuRef} className="noteGallery-context-menu"
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #F4F4F4",
              borderRadius: "5px",
              padding: "4px",
              listStyle: "none",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}>
            <li onClick={() => openRenameDialog(selectedItem)} style={{ color: "#3372ff" }} className="noteGallery-context-item">
              Rename
            </li>
            <li onClick={() => openDeleteDialog(selectedItem)} style={{ color: "red" }} className="noteGallery-context-item">
              Delete
            </li>
          </ul>
        )}

        {/* // Rename Dialog Component */}
        <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
          <DialogTitle>Rename Item</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="New Name"
              variant="outlined"
              value={renameInput}
              sx={{ marginTop: "10px" }}
              onChange={(e) => setRenameInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameConfirm} disabled={loadingRename} variant="contained" color="primary">
              {loadingRename ? "Renaming..." : "Rename"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* // Delete Dialog Component */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this item?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} disabled={loadingDelete} variant="contained" color="error">
              {loadingRename ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
