import React, { useState, useEffect } from 'react';
import './RegisterPrompt.css';

export default function RegisterPrompt({ onRegisterClick }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user');
    
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleRegister = () => {
    setIsVisible(false);
    onRegisterClick();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="register-prompt-overlay">
      <div className="register-prompt">
        <button className="register-prompt-close" onClick={handleClose}>&times;</button>
        
        <div className="register-prompt-content">
          <h2>Join Our Casino</h2>
          <p>Create an account now and start playing with amazing bonuses!</p>
          
          <div className="register-prompt-buttons">
            <button className="register-prompt-btn register" onClick={handleRegister}>
              Register Now
            </button>
            <button className="register-prompt-btn maybe-later" onClick={handleClose}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
