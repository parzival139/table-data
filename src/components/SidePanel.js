// src/components/SidePanel.js
import React from 'react';
import './SidePanel.css';
import CloseIcon from '@mui/icons-material/Close';

const SidePanel = ({ isOpen, onClose, children }) => {
  return (
    <div className={`side-panel ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="side-panel-content">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;

