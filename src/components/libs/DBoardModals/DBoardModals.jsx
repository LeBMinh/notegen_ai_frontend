import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { retrieveStorage, createFolder, createFileWithFolder } from '../../../server/api';

// Import folder data
// import folders from "../../libs/FolderList/FolderData"; 

export default function DBoardModals({ openMD, onClose, onNavigateToCanvas }) {
  const [currentModal, setCurrentModal] = useState("select"); // State to track which modal is active
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]); // Store retrieved folders
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch folders when modal opens
  useEffect(() => {
    if (open) {
      fetchFolders();
    }
  }, [open]);

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

      // if (filteredFolders.length > 0) {
      //   setActiveFolder(filteredFolders[0]._id);
      // }

    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchFolders(); // Fetch notes on mount
  }, []);

  const handleAddToFolder = () => setCurrentModal("choose");
  const handleSkip = () => onNavigateToCanvas();
  const handleAddNewFolder = () => setCurrentModal("newFolder");
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      console.log("Creating folder with name:", newFolderName); // Debugging

      await createFolder(newFolderName);
      setNewFolderName("");
      fetchFolders(); // Refresh folder list after creation
      setCurrentModal("choose");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };


  const handleSelectFolder = async (folderId) => {
    console.log("Selected Folder ID:", folderId); // Debugging

    try {
      const fileName = "Untitled note";
      const response = await createFileWithFolder(folderId, fileName);

      // Extract the correct file ID from the API response
      const fileId = response?.body?.data?._id;

      if (fileId) {
        console.log("New file created with ID:", fileId);
        navigate(`/notecanvas/${fileId}`);
        setCurrentModal("select");  // Đặt lại trạng thái nhưng không mở lại modal
        setTimeout(() => onClose(), 0); // Đảm bảo setState trước khi gọi onClose
      } else {
        console.error("File creation failed: No ID returned.");
      }
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const handleClose = () => {
    setCurrentModal("select");  // Đặt lại trạng thái nhưng không mở lại modal
    setTimeout(() => onClose(), 0); // Đảm bảo setState trước khi gọi onClose
  };

  const handleOpen = () => {
    setCurrentModal("select");
  };

  useEffect(() => {
    if (!openMD) {
      setCurrentModal("select");  // Reset về trạng thái ban đầu khi modal đóng
    }
  }, [openMD]);

  // useEffect(() => {
  //   console.log("Modal openMD changed:", openMD);
  // }, [openMD]);

  return (
    <>
      {/* Select Folder Modal */}
      <Dialog open={openMD && currentModal === "select"} onClose={handleClose}>
        <DialogTitle>
          Select folder
          {/* Close "X" Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Select a folder to add to, create a new folder, or skip.
          </Typography>
          <Grid container spacing={2} justifyContent="center" marginTop={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleAddToFolder}
                startIcon={<span role="img" aria-label="folder">📁</span>}
              >
                Add to folder
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleSkip}
                startIcon={<span role="img" aria-label="skip">⏭️</span>}
              >
                Skip for now
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>


      {/* Choose a Folder Modal */}
      <Dialog open={currentModal === "choose"} onClose={() => setCurrentModal("select")}>
        <DialogTitle sx={{ textAlign: "center" }}>Choose a folder</DialogTitle>
        <Button
          variant="contained"
          sx={{ width: '75%', alignSelf: "center" }}
          color="primary"
          onClick={handleAddNewFolder}
        >
          Add new folder
        </Button>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ maxHeight: "300px", overflowY: "auto" }}>

            {/* use retrieveStorage and filter data "type" ("type": "folder") to show list of folder according to their "name"
            a click on a folder button will trigger the createFile with folder_id associate to that folder button  */}
            {folders.map((folder) => (
              <Grid item xs={6} key={folder._id}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    console.log("Folder selected:", folder); // Debugging
                    handleSelectFolder(folder._id);
                  }}
                // startIcon={<span role="img" aria-label="folder">📂</span>}
                >
                  📂 {folder.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* New Folder Name Modal */}
      <Dialog open={currentModal === "newFolder"} onClose={() => setCurrentModal("choose")}>
        <DialogTitle>New folder name</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            sx={{ marginTop: '10px' }}
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => {
              console.log("Typing:", e.target.value); // Debugging
              setNewFolderName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentModal("choose")}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateFolder}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
