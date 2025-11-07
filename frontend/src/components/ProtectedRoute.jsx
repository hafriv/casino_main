import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [showModal, setShowModal] = useState(!isLoggedIn);

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      if (user) {
        setShowModal(false);
      }
    };

    checkLogin();

    const handleStorageChange = () => {
      checkLogin();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('userLoggedIn', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('userLoggedIn', handleStorageChange);
    };
  }, []);

  const handleCloseModal = () => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setShowModal(false);
    }
  };

  if (showModal && !isLoggedIn) {
    return (
      <div className="protected-route-overlay">
        <AuthModal isOpen={true} onClose={handleCloseModal} mode="register" />
      </div>
    );
  }

  return children;
}
