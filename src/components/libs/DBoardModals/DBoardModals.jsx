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
import folders from "../../libs/FolderList/FolderData"; // Import folder data

export default function DBoardModals({ openMD, onClose, onNavigateToCanvas }) {
  const [currentModal, setCurrentModal] = useState("select"); // State to track which modal is active
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddToFolder = () => setCurrentModal("choose");
  const handleSkip = () => onNavigateToCanvas();
  const handleAddNewFolder = () => setCurrentModal("newFolder");
  const handleCreateFolder = () => {
    console.log(`New folder created: ${newFolderName}`);
    setCurrentModal("choose");
    // Go back to "Choose a Folder" after creating a folder
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

            {folders.map((folder) => (
              <Grid item xs={6} key={folder.id}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<span role="img" aria-label="folder">📂</span>}
                >
                  {folder.title}
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
            onChange={(e) => setNewFolderName(e.target.value)}
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
