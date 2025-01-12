import React, { useState } from 'react';
import './HelpCenter.css';
import ContactUs_3D from '../../../assets/Stock3D-png/ContactUs.png';
import IssueDetails from '../../../assets/Icon_line/IssueDetails.svg';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function HelpCenter() {
  const [activeIssues, setActiveIssues] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const issues = [
    { text: "Slow performance", icon: IssueDetails },
    { text: "Sync errors", icon: IssueDetails },
    { text: "Data loss", icon: IssueDetails },
    { text: "Free feature limitations", icon: IssueDetails },
    { text: "Formatting issues", icon: IssueDetails },
    { text: "Weak search functionality", icon: IssueDetails },
  ];

  const handleIssueClick = (issueText) => {
    if (activeIssues.includes(issueText)) {
      setActiveIssues(activeIssues.filter(issue => issue !== issueText));
    } else {
      setActiveIssues([...activeIssues, issueText]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!name || !email || !textareaValue) {
      alert('Please fill out all required fields!');
      return;
    }

    // Simulate sending an email (replace this with actual email sending functionality)
    console.log("Sending email to: minhltbse173370@fpt.edu.vn");
    console.log("Subject: Report NoteGen AI issue from user " + name);
    console.log("Message: " + textareaValue);

    // Open success dialog and clear form
    setDialogOpen(true);
    setActiveIssues([]);
    setTextareaValue('');
    setName('');
    setEmail('');
  };

  return (
    <div className='contact-container'>
      <div className="contact-content">
        <img
          src={ContactUs_3D}
          alt={'ContactUs_3D Icon'}
          className="contactUs_3D-icon"
        />
        <p className='contactUs-title'>Contact us</p>
      </div>
      <div className="contact-table">
        <div class="issues-table">
          <h4>🛠 Issues</h4>
          <div className="issues-grid">
            {issues.map((issue, index) => (
              <button
                key={index}
                onClick={() => handleIssueClick(issue.text)}
                className={activeIssues.includes(issue.text) ? 'active' : ''}
              >
                {issue.icon && (
                  <img
                    src={issue.icon}
                    alt={'IssueDetails Icon'}
                    className="issue-icon"
                  />
                )}
                {issue.text}
              </button>
            ))}
          </div>
        </div>
        <div class="issues-textarea">
          <label htmlFor="detail">More detail</label>
          <textarea
            id="detail"
            className='textarea-box'
            placeholder="Tell us what's on your mind"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name"><span class="asterisk">*</span> Your name</label>
          <input
            type="text"
            id="name"
            placeholder="Input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={false}
          />

          <label htmlFor="email"><span class="asterisk">*</span> E-mail address</label>
          <input
            type="email"
            id="email"
            placeholder="Input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={false}
          />

          <button type="submit">Send</button>
        </form>
      </div>

      {/* Dialog for success */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <p>Your issue has been reported successfully!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
