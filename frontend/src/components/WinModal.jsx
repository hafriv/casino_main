import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './WinModal.css';

export default function WinModal({ isOpen, onClose, message }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={`win-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`win-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="win-modal-content">
          <p className="win-modal-message">{message}</p>
          <button className="win-modal-ok" onClick={handleClose}>OK</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}
