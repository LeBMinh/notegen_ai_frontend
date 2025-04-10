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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import './DBoardModals.css'
import { useNavigate } from "react-router-dom";
import { retrieveStorage, createFolder, createFileWithFolder } from '../../../server/api';
// Import folder data
import Folder from '../../../assets/Icon_fill/Folder.svg';
import AddNewFolder from '../../../assets/Icon_line/AddNewFolder.svg';

// Import folder data
// import folders from "../../libs/FolderList/FolderData"; 

export default function DBoardModals({ openMD, onClose, onNavigateToCanvas }) {
  const [currentModal, setCurrentModal] = useState("select"); // State to track which modal is active
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]); // Store retrieved folders
  const [loading, setLoading] = useState(true);
  const [loadingCreateFile, setLoadingreateFile] = useState(false);

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
  const handleSkip = async () => {
    if (loadingCreateFile) return; // Prevent multiple clicks

    setLoadingreateFile(true); // Start loading
    await onNavigateToCanvas(); // Trigger the function to create a note
    setLoadingreateFile(false); // Stop loading after request completes
  };
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
    // console.log("Selected Folder ID:", folderId); // Debugging

    try {
      const fileName = "Untitled note";
      const response = await createFileWithFolder(folderId, fileName);

      // Extract the correct file ID from the API response
      const fileId = response?.body?.data?._id;

      if (fileId) {
        // console.log("New file created with ID:", fileId);  // Debugging
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
        <DialogTitle
          sx={{
            p: 0, // Remove default padding
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: 70, // You can adjust this as needed
          }}>
          <div className="DBodals-dialog-title">
            Select folder
          </div>
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
          <Typography sx={{ fontSize: '13px', textAlign: 'center', color: '#2F2F2F' }}>
            Select a folder to add to, create a new folder, or skip.
          </Typography>
          <Grid container spacing={2} justifyContent="center" marginTop={1.5} marginBottom={0.5}>
            <Grid item>
              <Button
                sx={{ borderRadius: '12px' }}
                variant="outlined"
                onClick={handleAddToFolder}
                startIcon={<span role="img" aria-label="folder">📁</span>}
              >
                Add to folder
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  borderRadius: '12px',
                  minWidth: 170, // Ensures consistent width
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                variant="outlined"
                onClick={handleSkip}
                // startIcon={<span role="img" aria-label="skip">⏭️</span>}
                // startIcon={loadingCreateFile ? "" : <span role="img" aria-label="skip">⏭️</span>}
                startIcon={!loadingCreateFile && <span role="img" aria-label="skip">⏭️</span>}
                disabled={loadingCreateFile}
              >
                {loadingCreateFile ? <CircularProgress size={30} /> : "Skip for now"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>


      {/* Choose a Folder Modal */}
      <Dialog open={currentModal === "choose"} onClose={() => setCurrentModal("select")}>
        <DialogTitle
          sx={{
            p: 0, // Remove default padding
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: 70, // You can adjust this as needed
          }}>
          <div className="DBodals-dialog-title">
            Choose a folder
          </div>
          {/* Close "X" Button */}
          <IconButton
            aria-label="close"
            onClick={handleOpen}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* <DialogTitle sx={{ textAlign: "center" }}>Choose a folder</DialogTitle> */}
        <Typography sx={{ fontSize: '12px', textAlign: 'center', color: '#2F2F2F' }}>
          Success is not final, failure is not fatal: it is the <br /> courage to continue that counts.
        </Typography>
        <Button
          variant="contained"
          sx={{
            width: '75%',
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            mx: 'auto',   // Center horizontally
            my: 1.5,     // Vertical spacing (optional)
            borderRadius: '10px',
            color: '#3372FF',  // --primary-6
            background: '#98deff', // --primary-2
          }}
          // color="primary"
          onClick={handleAddNewFolder}
        >
          <img src={AddNewFolder} alt="AddNewFolder Icon" className="DBodals-addNewFolder-icon" />
          Add new folder
        </Button>
        <DialogContent dividers>
          <Grid container spacing={2} style={{ maxHeight: "300px", overflowY: "auto" }}>

            {folders.map((folder) => {
              // Replace folder name "Main" with "NoteGen Folder"
              const displayName = folder.name === "Main" ? "NoteGen Folder" : folder.name;

              return (
                <Grid item xs={6} key={folder._id}>
                  <Button
                    sx={{ borderRadius: '12px' }}
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      console.log("Folder selected:", folder); // Debugging
                      handleSelectFolder(folder._id);
                    }}
                  >
                    📂 {displayName}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* New Folder Name Modal */}
      <Dialog open={currentModal === "newFolder"} onClose={() => setCurrentModal("choose")}
        PaperProps={{
          sx: {
            width: '400px',        // or '60%', '40vw', etc.
            maxWidth: '90%',       // optional: responsive limit
          },
        }}>
        <DialogTitle
          sx={{
            p: 0, // Remove default padding
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: 70, // You can adjust this as needed
          }}>
          <div className="DBodals-dialog-title">
            New folder name
          </div>
          {/* Close "X" Button */}
          <IconButton
            aria-label="close"
            onClick={handleAddToFolder}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* <DialogTitle>New folder name</DialogTitle> */}
        <DialogContent sx={{ py: 0, }}>
          <Typography sx={{ fontSize: '12px', textAlign: 'center', color: '#2F2F2F' }}>
            Big ideas start small. Name it wisely.
          </Typography>
          <TextField
            fullWidth
            sx={{
              mt: 1.5, mb: 2,
            }}
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => {
              // console.log("Typing:", e.target.value); // Debugging
              setNewFolderName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentModal("choose")}>Cancel</Button>
          <Button
            sx={{ borderRadius: '10px' }}
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
