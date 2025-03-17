import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Typo from "typo-js";
import './NoteCanvas.css';
import { retrieveById, updateFileContent, processTextWithGemini } from '../../../server/api';

//import image
import NoFolder from '../../../assets/Stock3D-png/HomeFolder.png';
//import icons
import BackToPrevious from '../../../assets/Icon_line/BackToPrevious.svg';
import WordsCount from '../../../assets/Icon_line/WordsCount.svg';
import SpellingMistake from '../../../assets/Icon_line/SpellingMistake.svg';
import UntitledNote from '../../../assets/Icon_fill/UntitledNote.svg';
import EnhanceNote from '../../../assets/Icon_fill/EnhanceNote.svg';
import FolderTitle from '../../../assets/Icon_fill/Folder.svg';
import LastEditTime from '../../../assets/Icon_fill/RecentlyNote.svg';
import SeeEnhanced from '../../../assets/Icon_line/SeeOriginal_btn-FlashcardIcon.svg';
import CloseEnhanced from '../../../assets/Icon_line/Save_btn.svg';
//import toolbar icons
import UndoBtn from '../../../assets/Icon_line/Undo-MoveBack.svg';
import RedoBtn from '../../../assets/Icon_line/Redo-MoveForward.svg';
import Bold from '../../../assets/Icon_line/Bold.svg';
import Italic from '../../../assets/Icon_line/Italic.svg';
import Underline from '../../../assets/Icon_line/Underline.svg';
import BulletedList from '../../../assets/Icon_line/BulletedList.svg';
import NumberedList from '../../../assets/Icon_line/NumberedList.svg';
import LeftAlign from '../../../assets/Icon_line/LeftAlign.svg';
import CentreAlign from '../../../assets/Icon_line/CentreAlign.svg';
import RightAlign from '../../../assets/Icon_line/RightAlign.svg';
import InsertLlink from '../../../assets/Icon_line/Insert_link.svg';
import InsertImage from '../../../assets/Icon_line/InsertImage-Graph-Mindmap.svg';

// Forward ref to avoid findDOMNode issue
const CustomQuill = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

// Override Quill's default icons
const icons = ReactQuill.Quill.import("ui/icons");
// Text Formatting (Already working)
icons["bold"] = `<img src="${Bold}" alt="Bold">`;
icons["italic"] = `<img src="${Italic}" alt="Italic">`;
icons["underline"] = `<img src="${Underline}" alt="Underline">`;

// Lists
icons["list"]["bullet"] = `<img src="${BulletedList}" alt="BulletedList">`;
icons["list"]["ordered"] = `<img src="${NumberedList}" alt="NumberedList">`;

// Alignment
icons["align"][""] = `<img src="${LeftAlign}" alt="LeftAlign">`; // Default (Left)
icons["align"]["center"] = `<img src="${CentreAlign}" alt="CentreAlign">`;
icons["align"]["right"] = `<img src="${RightAlign}" alt="RightAlign">`;

// Media
icons["link"] = `<img src="${InsertLlink}" alt="InsertLink">`;
icons["image"] = `<img src="${InsertImage}" alt="InsertImage">`;

const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}

Quill.register(DividerBlot);

export default function NoteCanvas() {
  const { id } = useParams(); // Get the note ID from the URL
  // const trimmedId = id.startsWith(":") ? id.substring(1) : id; // Remove colon if present
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [text, setText] = useState('');
  const [previousText, setPreviousText] = useState("");
  const [summarizeText, setSummarizeText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [spellingMistakes, setSpellingMistakes] = useState(0);
  const [lastEdit, setLastEdit] = useState(new Date().toLocaleString());
  const [dictionary, setDictionary] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Saved"); // Default state is "Saved"
  const [loadingEnhance, setLoadingEnhance] = useState(false);
  const [isEnhancedMode, setIsEnhancedMode] = useState(false); // New state for transition


  const handleCloseNoteCanvas = () => {
    navigate(-1); // Go back one step in history
  };

  const quillRef = useRef(null);

  const handleLineDivider = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(); // Get cursor position

    if (range) {
      editor.insertEmbed(range.index, "divider", true); // Insert <hr> at cursor position
      editor.setSelection(range.index + 2); // Move cursor after the line
    }
  };

  //   const handleImageUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onloadend = () => {
  //             const base64String = reader.result; // Base64 encoded image
  //             insertImageIntoEditor(base64String);
  //         };
  //     }
  // };

  // const insertImageIntoEditor = (base64String) => {
  //   const quill = quillRef.current.getEditor(); 
  //   let range = quill.getSelection() || { index: quill.getLength() }; 

  //   // Strip the Data URI prefix (e.g., "data:image/png;base64,")
  //   const base64Data = base64String.split(",")[1]; 

  //   quill.insertEmbed(range.index, "image", `data:image/png;base64,${base64Data}`);
  // };

  // Fetch folder/note data from API
  useEffect(() => {
    async function fetchNoteAndFolder() {
      try {
        // Fetch note details
        const noteResponse = await retrieveById(id);
        if (noteResponse?.body?.data) {
          const noteData = noteResponse.body.data;
          setNote(noteData);
          setText(noteData.content.original || "");
          setSummarizeText(noteData.content.summarize || ""); // Load summarized text
          setNoteText(noteData.content.note || ""); // Load note text

          // Fetch folder details using folder_id
          if (noteData.folder_id) {
            const folderResponse = await retrieveById(noteData.folder_id, false);
            if (folderResponse?.body?.data) {
              setFolderName(folderResponse?.body?.data?.name); // Assuming folderResponse contains name
            }
          }
        }
      } catch (error) {
        console.error("Error fetching note or folder:", error);
      }
    }

    fetchNoteAndFolder();
  }, [id]);


  // Load Typo.js dictionary once
  useEffect(() => {
    const dict = new Typo("en_US", "/dictionaries/en_US.dic", "/dictionaries/en_US.aff");
    setDictionary(dict);
  }, []);

  // Update note data from API
  useEffect(() => {
    const interval = setInterval(() => {
      if (text !== previousText) {
        setSaveStatus("🕑 Saving in progress"); // Show "Saving..." before calling saveContent
        saveContent();
        setPreviousText(text);
      }
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, previousText]);

  const handleTextChange = (content) => {
    setText(content);
    setLastEdit(new Date().toLocaleString()); // Update last edit timestamp

    // Word count calculation
    const countWords = (content) => {
      if (content.trim().length === 0) {
        return 0;
      }
      const cleanedContent = content
        .replace(/(^\s*)|(\s*$)/gi, '') // Remove leading/trailing spaces
        .replace(/[ ]{2,}/gi, ' ') // Replace multiple spaces with a single space
        .replace(/\n /, '\n'); // Handle newlines
      return cleanedContent.split(/\s+/).length;
    };
    setWordCount(countWords(content));

    // Spell checking (only if dictionary is ready)
    if (dictionary) {
      const words = content.split(/\s+/);
      const misspelledWords = words.filter((word) => !dictionary.check(word));
      setSpellingMistakes(misspelledWords.length);
    }
  };

  const saveContent = async () => {
    if (id && text !== previousText) {
      try {
        console.log("Saving content...", text);

        const response = await updateFileContent(id, text);
        console.log("Save response:", response);
        setPreviousText(text); // Only update previousText after successful save

        setSaveStatus("Saved ✔️"); //  Move this here after success
        // Reset save status after a few seconds
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Error saving content:", error);
        setSaveStatus("Failed to save"); // Show error message on failure
      }
    }
  };

  const handleEnhanceNote = async () => {
    if (!note || !id) {
      console.error("No note data available or invalid ID.");
      return;
    }
    setLoadingEnhance(true);
    // Get the latest original content, fallback to `text` if unavailable
    const originalContent = note.content?.original || text;

    // Remove HTML tags
    const cleanedText = originalContent.replace(/<\/?[^>]+(>|$)/g, "");

    try {
      console.log("Sending text for enhancement:", cleanedText);

      // Call API
      const response = await processTextWithGemini(cleanedText, id);

      console.log("Enhanced response:", response);

      // Check if response body contains valid data
      if (response?.body?.data?.content) {
        const { summarize, note } = response.body.data.content;

        // Update state with AI-processed content
        setSummarizeText(summarize);
        setNoteText(note);
      }

      setLoadingEnhance(false);
      setIsEnhancedMode(isEnhancedMode);
    } catch (error) {
      console.error("Error enhancing note:", error);
      setLoadingEnhance(false);
    }
  };

  const toggleEnhancedMode = () => {
    setIsEnhancedMode(!isEnhancedMode);
  };

  // Toolbar Configuration
  // const toolbarOptions = {
  //   items: [
  //     [{ header: [1, 2, 3, 4, false] }], // Heading options
  //     [{ font: [] }], // Fonts
  //     ['bold', 'italic', 'underline', 'strike'], // Text styles
  //     [{ list: 'ordered' }, { list: 'bullet' }], // Lists
  //     [{ script: 'sub' }, { script: 'super' }], // Subscript/Superscript
  //     [{ indent: '-1' }, { indent: '+1' }], // Indentation
  //     [{ align: [] }], // Alignment
  //     [{ color: [] }, { background: [] }], // Text color & background
  //     ['link', 'image', 'video'], // Media options
  //     ['clean'], // Remove formatting
  //   ],
  // };
  const handleUndo = () => {
    quillRef.current.getEditor().history.undo();
  };

  const handleRedo = () => {
    quillRef.current.getEditor().history.redo();
  };

  if (!note) {
    // console.log("Note not found for ID:", id);
    return <div className="noteCanvas-error">
      <img
        src={NoFolder}
        alt={'NoFolder Icon'}
        className="noFolder-icon"
      />
      Note not found! Try another note..
    </div>;
  }

  return (
    <div className={`noteCanvas-container ${isEnhancedMode ? "enhanced-mode" : ""}`}>
      {/* === Standard Mode === */}
      {!isEnhancedMode ? (
        <>
          {/* Main Editor */}
          <div className="noteCanvas-main">
            <div className="noteCanvas-header">
              <div className="noteCanvas-header-left">
                <div className="noteCanvas-back-btn-container" onClick={handleCloseNoteCanvas}>
                  <img src={BackToPrevious} alt="BackToPrevious Icon" className="backToPrevious-icon" />
                </div>
                <div className="noteCanvas-noteTitle-container">
                  <img src={UntitledNote} alt="Note Title Icon" className="noteCanvas-noteTitle-icon" />
                  <h2 className="noteCanvas-title">{note.name || 'Untitled Note'}</h2>
                </div>
              </div>

              <div id="toolbar">
                {/* Undo & Redo */}
                <button onClick={handleUndo}>
                  <img src={UndoBtn} alt="Undo" className="undo-redo-filterIcon" />
                </button>
                <button onClick={handleRedo}>
                  <img src={RedoBtn} alt="Redo" className="undo-redo-filterIcon" />
                </button>

                {/* Divider before Text Formatting */}
                <div className="toolbar-divider"></div>

                {/* Text Formatting */}
                <div className="toolbar-wrapper">
                  <button type="button" className="ql-bold">
                    <img src={Bold} alt="Bold" />
                  </button>
                  <button className="ql-italic">
                    <img src={Italic} alt="Italic" />
                  </button>
                  <button className="ql-underline">
                    <img src={Underline} alt="Underline" />
                  </button>
                </div>

                <div className="toolbar-wrapper">
                  {/* Lists */}
                  <button className="ql-list" value="bullet">
                    <img src={BulletedList} alt="Bulleted List" />
                  </button>
                  <button className="ql-list" value="ordered">
                    <img src={NumberedList} alt="Numbered List" />
                  </button>

                  {/* Text Color */}
                  <button className="color-picker-btn">
                    <select className="ql-color"></select>
                  </button>

                  {/* Alignment */}
                  <button className="ql-align" value="">
                    <img src={LeftAlign} alt="Left Align" />
                  </button>
                  <button className="ql-align" value="center">
                    <img src={CentreAlign} alt="Center Align" />
                  </button>
                  <button className="ql-align" value="right">
                    <img src={RightAlign} alt="Right Align" />
                  </button>

                  {/* Line Divider */}
                  <button onClick={handleLineDivider}>
                    <img src={UntitledNote} alt="Insert Divider" />
                  </button>

                  {/* Media */}
                  <button className="ql-link">
                    <img src={InsertLlink} alt="Insert Link" />
                  </button>
                  {/* <button className="ql-image" onClick={handleImageUpload}>
                <span><img src={InsertImage} alt="Insert Image" /></span>
              </button> */}
                </div>
              </div>
            </div>

            {/* Quill Editor */}
            <CustomQuill
              ref={quillRef}
              value={text}
              onChange={handleTextChange}
              theme="snow"
              modules={{ toolbar: "#toolbar" }}
              className="noteCanvas-quill"
            />
          </div>

          {/* Side Config */}
          <div className="noteCanvas-config">
            <div className="noteCanvas-enhance-btn-container" onClick={handleEnhanceNote}>
              <img src={EnhanceNote} alt="EnhanceNote Icon" className="enhanceNote-icon" />
              {loadingEnhance ? "Enhancing..." : "Enhance note"}
            </div>

            {/* === Stats Section === */}
            <div className="noteCanvas-stats">
              <div className="noteCanvas-stat-card">
                <img src={WordsCount} alt="WordsCount Icon" className="wordsCount-icon" />
                <p>Words count</p>
                {/* 'statsNum-container' from Infomation className*/}
                <div className="statsNum-container">
                  <div className="noteCanvas-wordCount-stats-number">{wordCount}</div>
                </div>
              </div>
              <div className="noteCanvas-stat-card">
                <img src={SpellingMistake} alt="SpellingMistake Icon" className="spellingMistake-icon" />
                <p>Spelling mistake</p>
                {/* 'statsNum-container' from Infomation className*/}
                <div className="statsNum-container">
                  <div className="noteCanvas-spellingMistake-stats-number">{spellingMistakes}</div>
                </div>
              </div>
            </div>

            {/* === Save Status === */}
            <div className='noteCanvas-save-container'>
              <div className={`noteCanvas-save-status ${saveStatus.toLowerCase()}`}>
                {saveStatus || "Saving...?"}
              </div>
            </div>


            {/* === Folder Info === */}
            <div className="noteCanvas-folder-info">
              <img src={FolderTitle} alt="FolderTitle Icon" className="folderTitle-icon" />
              <p style={{ fontWeight: 'bold' }}>
                {folderName
                  ? folderName === "Main" || folderName === "" ? "NoteGen folder" : folderName
                  : "Not Assigned"}
              </p>
            </div>

            {/* === Last Edit Section === */}
            <div className="noteCanvas-last-edit">
              <img src={LastEditTime} alt="LastEditTime Icon" className="lastEditTime-icon" />
              <div>
                <p style={{ fontWeight: 'bold' }}>Last Edit:</p>
                <p>{lastEdit}</p>
              </div>
            </div>

            {/* === View Summarized Button === */}
            <div className="noteCanvas-seeEnhanced-container" onClick={toggleEnhancedMode}>
              <img src={SeeEnhanced} alt="See enhanced note" className='noteCanvas-seeEnhanced-icon' />
              See enhanced note
            </div>

          </div>
        </>
      ) : (
        <>
          {/* === Enhanced Mode: Two Quill Editors === */}
          {/* Left side before enhance */}
          <div className='noteCanvas-main'>
            <div className="noteCanvas-header-left">
              <div className="noteCanvas-back-btn-container" onClick={handleCloseNoteCanvas}>
                <img src={BackToPrevious} alt="BackToPrevious Icon" className="backToPrevious-icon" />
              </div>
              <div className="noteCanvas-noteTitle-container">
                <img src={UntitledNote} alt="Note Title Icon" className="noteCanvas-noteTitle-icon" />
                <h2 className="noteCanvas-title">{note.name || 'Untitled Note'}</h2>
              </div>
            </div>

            {/* Origianal Quill Editor */}
            <div className="noteCanvas-original-quill-section">
              <p className='noteCanvas-original-header'>
                ⚠️ None of your change will be saved from here, close enhanced note to continue
              </p>
              <ReactQuill
                value={text}
                modules={{ toolbar: false }}
                placeholder="Original version of your note..."
              />
            </div>
          </div>

          {/* Right side after enhance */}
          <div className="noteCanvas-enhanced-container">
            {/* Two Top Buttons */}
            <div className="noteCanvas-enhanced-header">
              <div className="noteCanvas-enhance-btn-container">
                <img src={EnhanceNote} alt="EnhanceNote Icon" className="enhanceNote-icon" />
                Re-generate
              </div>
              <div className="noteCanvas-closeEnhance-btn-container" onClick={toggleEnhancedMode}>
                <img src={CloseEnhanced} alt="CloseEnhanced Icon" className="closeEnhanced-icon" />
                Close enhanced note
              </div>
            </div>

            {/* Two Quill Editors */}
            <div className="noteCanvas-enhanced-quill-container">
              <div className="noteCanvas-quill-section">
                <h3>Summarize for {note.name}</h3>
                <ReactQuill
                  value={summarizeText}
                  onChange={setSummarizeText}
                  modules={{ toolbar: false }}
                  placeholder="Summarized note version..."
                />
              </div>

              <div className='noteCanvas-quill-divider'></div>

              <div className="noteCanvas-quill-section">
                <h3>Note enhance for {note.name}</h3>
                <ReactQuill
                  value={noteText}
                  onChange={setNoteText}
                  modules={{ toolbar: false }}
                  placeholder="Enhanced notes version..."
                />
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
