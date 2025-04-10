import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { createFile, retrieveStorage } from '../../../server/api';
import CircularProgress from "@mui/material/CircularProgress";
//import modals for new note
import DBoardModals from "../../libs/DBoardModals/DBoardModals";

// import image
import NoNote from '../../../assets/Stock3D-png/HomeFolder.png';
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
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingFile, setCreatingFile] = useState(false);
  const navigate = useNavigate();

  const timeAgo = (timestamp) => {
    const now = new Date(); // Local time
    const past = new Date(timestamp); // Convert timestamp from UTC

    // Adjust for local timezone offset
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localPast = new Date(past.getTime() - timezoneOffset); // Convert UTC to local time

    const diffMs = now - localPast; // Corrected time difference

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Fetch notes from API
  const fetchNotes = async () => {
    setLoading(true);

    try {
      const response = await retrieveStorage();

      // console.log("Raw API Response:", response); // Debugging log

      // Ensure response has a 'body' and then check if it has 'data'
      if (!response || !response.body || !Array.isArray(response.body.data)) {
        console.error("Error: Unexpected API response format", response);
        return;
      }

      const data = response.body.data; // Extracting the actual notes array

      // Ensure the data is an array
      if (!Array.isArray(data)) {
        console.error("Error: API did not return an array. Received:", data);
        return;
      }

      // Filter and sort notes
      const filteredNotes = data
        .filter((note) => note.type === "file" && !note.is_deleted)
        .sort((a, b) =>
          new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
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
    // console.log("Fetching notes...");
    fetchNotes();
  }, []); // Empty dependency array ensures it runs once on mount  


  const handlePinNote = (note) => {
    setPinnedNotes(prevPinnedNotes => {
      return prevPinnedNotes.find((pinnedNote) => pinnedNote._id === note._id)
        ? prevPinnedNotes.filter((pinnedNote) => pinnedNote._id !== note._id)
        : [...prevPinnedNotes, note];
    });
  };


  const filteredNotes = useMemo(() => {
    return [
      ...pinnedNotes.filter((note) =>
        note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content.original && note.content.original.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
      ...notes.filter((note) =>
        !pinnedNotes.some((pinnedNote) => pinnedNote._id === note._id) &&
        (note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (note.content.original && note.content.original.toLowerCase().includes(searchTerm.toLowerCase())))
      ),
    ];
  }, [searchTerm, notes, pinnedNotes]);



  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;  // No search term, return original text
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  };


  const handleOpenModal = () => {
    if (isModalOpen) return; // Ngăn việc mở lại modal ngay khi nó đang đóng
    console.log("Opening Modal...");

    setCurrentModal("select");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing Modal...");

    setIsModalOpen(false);
    // setCurrentModal(null); 
  };

  const handleNavigateToCanvas = async () => {
    if (creatingFile) return; // Prevent multiple clicks
    setCreatingFile(true); // Start loading

    try {
      const fileName = "Untitled note";
      const folderId = null; // No folder selected (BE will assign a default folder)

      // Create the file using the modified API function
      const response = await createFile(folderId, fileName);

      // Extract the correct file ID from the API response
      const fileId = response?.body?.data?._id;

      if (fileId) {
        // console.log("New file created with ID:", fileId);   // Debugging
        navigate(`/notecanvas/${fileId}`);
        setIsModalOpen(false);
      } else {
        console.error("File creation failed: No ID returned.");
      }
    } catch (error) {
      console.error("Error creating new file:", error);
    } finally {
      setCreatingFile(false); // Stop loading
    }
  };


  const handleNoteToCanvas = (file_id) => {
    if (file_id) {
      navigate(`/notecanvas/${file_id}`);
    } else {
      console.error("Invalid file_id:", file_id);
    }
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
      <div className="dashboard-takeNote-board" onClick={handleOpenModal}>
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
        <DBoardModals
          openMD={isModalOpen}
          // currentModal={currentModal} 
          onClose={handleCloseModal}
          onNavigateToCanvas={handleNavigateToCanvas}
        />
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
          {loading ? (
            <div className="dashboard-note-loading-container">
              <CircularProgress size={40} />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="dashboard-noRecent-note">
              <img
                src={NoNote}
                alt={'NoNote Icon'}
                className="dashboard-noNote-icon"
              />
              No note? Let's get start by click on "Take note now" or "Grab your note" on the sidebar 📑
            </div>
          ) : (
            filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => (
                <div key={note._id || index} className="dashboard-note-card" onClick={() => handleNoteToCanvas(note._id)}>
                  <span className="dashboard-note-time">
                    <img src={EditTimeAgo} alt="Time Icon" className="dashboard-note-timeAgo-icon" />
                    {timeAgo(note.updated_at || note.created_at)}
                  </span>
                  {/* <img
                  src={Pin}
                  alt="Pin Icon"
                  className="dashboard-note-pin-icon"
                  onClick={() => handlePinNote(note)} // Attach click event
                /> */}
                  <div className="dashboard-note-TandC">
                    <h3 className="dashboard-note-title">
                      {note.name.length > 30 ? `${note.name.slice(0, 30)}...` : note.name}
                    </h3>
                    <p
                      className="dashboard-note-content"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          note.content.original.length > 70 || note.content.original.length == 0
                            ? `${note.content.original.slice(0, 70)}...`
                            : note.content.original,
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
            )
          )}
        </div>
      </div>

    </div>
  )
}
