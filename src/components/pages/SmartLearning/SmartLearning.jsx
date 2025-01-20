import React from 'react';
import './SmartLearning.css';
import SubcriptionNow_3D from '../../../assets/Stock3D-png/SubcriptionNow.png';
import TryBeta from '../../../assets/Icon_fill/EnhanceNote.svg';

export default function SmartLearning() {
  return (
    <div className='smartlearn-container'>
          <div className="smartlearn-content">
            <img
              src={SubcriptionNow_3D}
              alt={'SubcriptionNow_3D Icon'}
              className="subcriptionNow_3D-icon"
            />
            <a
             href="https://notegenai01.framer.website/" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="trybeta-btn"
             >
              <img src={TryBeta} alt="Try Beta Icon" className="tryBeta-icon" />
              Try Beta
            </a>
            <p className='comming-soon'>Comming soon</p>
            <p className='smartlearn-description'>
              This feature is currently under development. <br/>
            You can try out the flashcard review set in beta mode now.</p>
          </div>
        </div>
  )
}
