import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './HelpCenter.css';
import ContactUs_3D from '../../../assets/Stock3D-png/ContactUs.png';
import IssueDetails from '../../../assets/Icon_line/IssueDetails.svg';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function HelpCenter() {
  const [activeIssues, setActiveIssues] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useRef();

  const issues = [
    { text: "Slow performance", icon: IssueDetails },
    { text: "Sync errors", icon: IssueDetails },
    { text: "Data loss", icon: IssueDetails },
    { text: "Free feature limitations", icon: IssueDetails },
    { text: "Formatting issues", icon: IssueDetails },
    { text: "Weak search functionality", icon: IssueDetails },
  ];

  const handleIssueClick = (issueText) => {
    let updatedIssues;
  
    if (activeIssues.includes(issueText)) {
      // Remove the issue if it's already selected
      updatedIssues = activeIssues.filter(issue => issue !== issueText);
    } else {
      // Add the new issue
      updatedIssues = [...activeIssues, issueText];
    }
  
    setActiveIssues(updatedIssues);
  
    // Format the textarea content with selected issues
    const formattedText = updatedIssues.map(issue => `*${issue}*`).join(" ");
  
    setTextareaValue(formattedText);
  };  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!name || !email || !textareaValue) {
      alert('Please fill out all required fields!');
      return;
    }

    // Simulate sending an email (replace this with actual email sending functionality)
    // console.log("Sending email to: minhltbse173370@fpt.edu.vn");
    // console.log("Subject: Report NoteGen AI issue from user " + name);
    // console.log("Message: " + textareaValue);
    emailjs
      .sendForm('service_2fhe6nr', 'template_nc42e1f', form.current, {
        publicKey: 'vSemh7kIXJWAPVyK5',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

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

        <form ref={form} onSubmit={handleSubmit}>
          <div class="issues-textarea">
            <label htmlFor="detail">More detail</label>
            <textarea
              id="detail"
              name="message"
              className='textarea-box'
              placeholder="Tell us what's on your mind"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>

          <label htmlFor="name"><span class="asterisk">*</span> Your name</label>
          <input
            type="text"
            id="name"
            name="user_name"
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
            name="user_email"
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
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <DialogTitle sx={{ color: "#3372ff", fontWeight: "bold" }}>Success</DialogTitle>
        <DialogContent>
          <p>Your issue has been reported! We appreciate your feedback and support. <br />
            It's your motivation that helps our product even better! 📝✨</p>
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
