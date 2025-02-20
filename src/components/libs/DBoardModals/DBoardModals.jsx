import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import folders from "../../libs/FolderList/FolderData"; // Import folder data

export default function DBoardModals({ open, onClose, onNavigateToCanvas }) {
  const [currentModal, setCurrentModal] = useState("select"); // State to track which modal is active
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddToFolder = () => setCurrentModal("choose");
  const handleSkip = () => onNavigateToCanvas();
  const handleAddNewFolder = () => setCurrentModal("newFolder");
  const handleCreateFolder = () => {
    console.log(`New folder created: ${newFolderName}`);
    setCurrentModal("choose"); // Go back to "Choose a Folder" after creating a folder
  };

  return (
    <>
      {/* Select Folder Modal */}
      <Dialog open={open && currentModal === "select"} onClose={onClose}>
        <DialogTitle>Select folder</DialogTitle>
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
      <Dialog open={currentModal === "choose"} onClose={onClose}>
        <DialogTitle>Choose a folder</DialogTitle>
        <DialogContent>
          <Typography variant="body2" marginBottom={2}>
            Success is not final, failure is not fatal: it is the courage to
            continue that counts.
          </Typography>
          <Grid container spacing={2}>
            {folders.slice(0, 7).map((folder) => (
              <Grid item xs={6} key={folder.id}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<span role="img" aria-label="folder">📂</span>}
                >
                  {folder.name} ({folder.count})
                </Button>
              </Grid>
            ))}
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleAddNewFolder}
              >
                Add new folder
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* New Folder Name Modal */}
      <Dialog open={currentModal === "newFolder"} onClose={onClose}>
        <DialogTitle>New folder name</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
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
