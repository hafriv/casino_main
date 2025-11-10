import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const [formMode, setFormMode] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormMode(mode);
      setError('');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isOpen, mode]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password_hash: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const newUser = await response.json();
      localStorage.setItem('user', JSON.stringify(newUser));
      document.dispatchEvent(new CustomEvent('userLoggedIn'));
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      handleClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const users = await response.json();
      const user = users.find(u => u.username === formData.username);

      if (!user || user.password_hash !== formData.password) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('user', JSON.stringify(user));
      document.dispatchEvent(new CustomEvent('userLoggedIn'));
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      handleClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={`auth-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`auth-modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>&times;</button>

        {formMode === 'register' ? (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Registration</h2>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>

            {error && <div className={`form-message ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>

            <p className="auth-toggle">
              Already have an account?
              <button type="button" onClick={() => { setFormMode('login'); setError(''); }} className="auth-link">
                Login
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>

            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <input
                type="text"
                id="login-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            {error && <div className="form-message error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="auth-toggle">
              Don't have an account?
              <button type="button" onClick={() => { setFormMode('register'); setError(''); }} className="auth-link">
                Register
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}
