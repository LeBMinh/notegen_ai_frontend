import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NoteGallery.css";
import { retrieveStorage, moveFile, renameStorageItem, deleteStorageItem } from '../../../server/api';
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Menu, MenuItem, ListItemIcon, ListItemText, Pagination } from "@mui/material";

// import image
import NoFolder from '../../../assets/Stock3D-png/NoteGallery.png';
import NoNote from '../../../assets/Stock3D-png/NoteCanvas.png';
//import icons
import MagnifyingGlass from '../../../assets/Icon_line/FindNow.svg';
import Folder from '../../../assets/Icon_fill/Folder.svg';
import NoteCard from '../../../assets/Icon_fill/UntitledNote.svg';
import FolderTitle from '../../../assets/Icon_line/AddNewFolder.svg';
import RenameFile from '../../../assets/Icon_line/WordsCount.svg';
import TrashBin from '../../../assets/Icon_line/TrashBin.svg';

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
  const [newName, setNewName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // Fetch storage data
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await retrieveStorage();
      // console.log("Raw API Response:", response); // Debugging

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
      // console.log("Raw API Response:", response); // Debugging

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

  // Customize "Main" folder from BE to "NoteGen Folder"
  const getFolderDisplayName = (folderName) => {
    return folderName === "Main" ? "NoteGen Folder" : folderName;
  };

  // Handle right-click to open context menu
  const handleRightClick = (event, item, type) => {
    event.preventDefault();
    setSelectedItem({ ...item, type });
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  // Handle closing the context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Handle opening rename dialog
  const handleRenameClick = () => {
    setRenameDialogOpen(true);
    handleCloseContextMenu();
  };

  // Handle renaming a file or folder
  const handleRename = async () => {
    if (!selectedItem) return;

    try {
      await renameStorageItem(
        selectedItem.type === "file" ? selectedItem._id : null, // item_id
        selectedItem.type === "folder" ? selectedItem._id : null, // folder_id
        newName
      );
      setRenameDialogOpen(false);
      setNewName("");
      fetchNotes();
      fetchFolders();
    } catch (error) {
      console.error("Error renaming item:", error);
    }
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseContextMenu();
  };

  // Handle deleting a file or folder
  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteStorageItem(
        selectedItem.type === "file" ? selectedItem._id : null, // item_id
        selectedItem.type === "folder" ? selectedItem._id : null // folder_id
      );
      setDeleteDialogOpen(false);
      fetchNotes();
      fetchFolders();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Pagination for Note list
  const itemsPerPage = 10; // 2 columns * 5 rows

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
          {loading ? (
            <div className="notes-gallery-Folderloading-container">
              <CircularProgress size={40} />
            </div>
          ) : folders.length === 0 ? (
            <div className="notes-gallery-no-folder-message">
              <img
                src={NoFolder}
                alt={'NoFolder Icon'}
                className="notes-gallery-noFolder-icon"
              />
              Nothing here?! <i> Grab Your Note </i> now!!
            </div>
          ) : (
            folders.map((folder) => (
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
                        getFolderDisplayName(folder.name).length > 20
                          ? `${getFolderDisplayName(folder.name).slice(0, 20)}...`
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
            )))}
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
        <div className="notes-gallery-heightAdjust-container">
          <div className="notes-gallery-container">
            {loading ? (
              <div className="notes-gallery-loading-container">
                <CircularProgress size={40} />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="notes-gallery-no-note-message">
                <img
                  src={NoNote}
                  alt={'NoNote Icon'}
                  className="notes-gallery-noNote-icon"
                />
                No note? Go create some 📑
              </div>
            ) : (
              paginatedNotes.map(note => (
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
                          __html: highlightText(
                            note.name.length > 30 || note.name.length == 0
                              ? `${note.name.slice(0, 30)}...`
                              : note.name
                            , searchTerm
                          ),
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
        </div>

        {/* MUI Pagination Counter */}
        <Pagination
          count={Math.ceil(filteredNotes.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          shape="rounded"
          className="noteGallery-notes-pagination"
        />

        <div className="noteGallery-rightClick-container">
          {/* Right Click Context Menu */}
          <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleRenameClick}>
              <ListItemIcon>
                <img src={RenameFile} alt="Rename Icon" className="noteGallery-menu-icon" />
              </ListItemIcon>
              <ListItemText>Rename</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <img src={TrashBin} alt="Trash Icon" className="noteGallery-menu-icon" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>

          {/* Rename Dialog */}
          <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
            <DialogTitle>Rename {selectedItem?.type === "file" ? "File" : "Folder"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New Name"
                fullWidth
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRename} color="primary" variant="contained">Rename</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this {selectedItem?.type === "file" ? "file" : "folder"}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </div>

      </div>
    </div>
  )
}
