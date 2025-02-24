import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import folders from '../../libs/FolderList/FolderData';
import './NoteCanvas.css';
import NoFolder from '../../../assets/Stock3D-png/HomeFolder.png';
//import icons
import BackToPrevious from '../../../assets/Icon_line/BackToPrevious.svg';
import WordsCount from '../../../assets/Icon_line/WordsCount.svg';
import SpellingMistake from '../../../assets/Icon_line/SpellingMistake.svg';
import UntitledNote from '../../../assets/Icon_fill/UntitledNote.svg';
import EnhanceNote from '../../../assets/Icon_fill/EnhanceNote.svg';
import FolderTitle from '../../../assets/Icon_fill/Folder.svg';
import LastEditTime from '../../../assets/Icon_fill/RecentlyNote.svg';
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
icons["bold"] = `<img src="/src/assets/Icon_line/Bold.svg" alt="Bold">`;
icons["italic"] = `<img src="/src/assets/Icon_line/Italic.svg" alt="Italic">`;
icons["underline"] = `<img src="/src/assets/Icon_line/Underline.svg" alt="Underline">`;

// Lists
icons["list"]["bullet"] = `<img src="/src/assets/Icon_line/BulletedList.svg" alt="BulletedList">`;
icons["list"]["ordered"] = `<img src="/src/assets/Icon_line/NumberedList.svg" alt="NumberedList">`;

// Alignment
icons["align"][""] = `<img src="/src/assets/Icon_line/LeftAlign.svg" alt="LeftAlign">`; // Default (Left)
icons["align"]["center"] = `<img src="/src/assets/Icon_line/CentreAlign.svg" alt="CentreAlign">`;
icons["align"]["right"] = `<img src="/src/assets/Icon_line/RightAlign.svg" alt="RightAlign">`;

// Media
icons["link"] = `<img src="/src/assets/Icon_line/Insert_link.svg" alt="InsertLink">`;
icons["image"] = `<img src="/src/assets/Icon_line/InsertImage-Graph-Mindmap.svg" alt="InsertImage">`;

const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}

Quill.register(DividerBlot);

export default function NoteCanvas() {
  const { id } = useParams(); // Get the note ID from the URL
  const trimmedId = id.startsWith(":") ? id.substring(1) : id; // Remove colon if present

  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [spellingMistakes, setSpellingMistakes] = useState(0);
  const [lastEdit, setLastEdit] = useState(new Date().toLocaleString());

  const quillRef = useRef(null);

  const handleLineDivider = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(); // Get cursor position

    if (range) {
      editor.insertEmbed(range.index, "divider", true); // Insert <hr> at cursor position
      editor.setSelection(range.index + 2); // Move cursor after the line
    }
  };

  // Find the note based on the ID
  const note = folders
    .flatMap((folder) => folder.notes)
    .find((note) => {
      // console.log("Checking note ID:", note.id, "against URL ID:", trimmedId);
      return note.id === trimmedId;
    });

  useEffect(() => {
    if (note) {
      setText(note.content); // Load note content on mount
    }
  }, [note]);

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

    // Spelling mistake logic can be added here
    setSpellingMistakes(0); // Placeholder (implement logic below)
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
    console.log("Note not found for ID:", id);
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
    <div className="noteCanvas-container">
      {/* Main Editor */}
      <div className="noteCanvas-main">
        <div className="noteCanvas-header">
          <div className="noteCanvas-header-left">
            <div className="noteCanvas-back-btn-container">
              <img src={BackToPrevious} alt="BackToPrevious Icon" className="backToPrevious-icon" />
            </div>
            <div className="noteCanvas-noteTitle-container">
              <img src={UntitledNote} alt="Note Title Icon" className="noteCanvas-noteTitle-icon" />
              <h2 className="noteCanvas-title">{note.title || 'Untitled Note'}</h2>
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
              <button className="ql-image">
                <span><img src={InsertImage} alt="Insert Image" /></span>
              </button>
              {/* Video option can be added here */}
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
        <div className="noteCanvas-enhance-btn-container">
          <img src={EnhanceNote} alt="EnhanceNote Icon" className="enhanceNote-icon" />
          Enhance note
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

        {/* === Folder Info === */}
        <div className="noteCanvas-folder-info">
          <img src={FolderTitle} alt="FolderTitle Icon" className="folderTitle-icon" />
          <p style={{ fontWeight: 'bold' }}>{note.folder || 'Not Assigned'}</p>
        </div>

        {/* === Last Edit Section === */}
        <div className="noteCanvas-last-edit">
          <img src={LastEditTime} alt="LastEditTime Icon" className="lastEditTime-icon" />
          <div>
            <p style={{ fontWeight: 'bold' }}>Last Edit:</p>
            <p>{lastEdit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
