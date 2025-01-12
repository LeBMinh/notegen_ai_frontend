import React from 'react';
import './Trash.css';
import Trash_3D from '../../../assets/Stock3D-png/Trash.png';

export default function Trash() {
  return (
    <div className='trashContainer'>
      <div className="noFile-content">
        <img
          src={Trash_3D}
          alt={'Trash_3D Icon'}
          className="trash3D-icon"
        />
        <p className='trashZero'>Trash (0)</p>
        <p className='noFileTrash'>Nothing here</p>
      </div>
    </div>
  )
}
