import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Granim from 'granim';
import OnlinePlayers from './OnlinePlayers';
import AuthModal from './AuthModal';
import logo from '../assets/logo.png';
import bonus from '../assets/bonus.gif';

export default function Header() {
    const location = useLocation();
    const [underline, setUnderline] = useState({ width: 0, left: 0, opacity: 0 });
    const ulRef = useRef(null);
    const canvasRef = useRef(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setBalance(Number(user.balance || 0));
            // Dispatch event to notify other components
            setTimeout(() => document.dispatchEvent(new Event('balanceUpdated')), 0);
        }
    }, []);

    useEffect(() => {
        const handleBalanceUpdate = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setBalance(Number(user.balance || 0));
            }
        };

        document.addEventListener('balanceUpdated', handleBalanceUpdate);
        return () => document.removeEventListener('balanceUpdated', handleBalanceUpdate);
    }, []);


    useEffect(() => {
        if (canvasRef.current) {
            new Granim({
                element: canvasRef.current,
                direction: 'diagonal',
                states: {
                    "default-state": {
                        gradients: [
                            ['#001a33', '#003366'],
                            ['#003366', '#001a33']
                        ],
                        transitionSpeed: 4000
                    }
                }
            });
        }
    }, []);



    const HeaderBackground = () => {
        return null;
    };

    const handleMouseEnter = (event) => {
        const li = event.currentTarget;
        const index = Array.from(ulRef.current.children).indexOf(li);
        if (index !== -1) {
            const liRect = li.getBoundingClientRect();
            const ulRect = ulRef.current.getBoundingClientRect();
            setUnderline({
                width: liRect.width,
                left: liRect.left - ulRect.left,
                opacity: 1
            });
        }
    };

    const handleMouseLeave = () => {
        setUnderline(prev => ({ ...prev, opacity: 0 }));
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMobile = () => setMobileOpen(v => !v);

    const handleOpenAuth = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };

    const handleCloseAuth = () => {
        setAuthModalOpen(false);
        setIsLoggedIn(!!localStorage.getItem('user'));
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setBalance(user.balance);
        } else {
            setBalance(0);
        }
        // Dispatch event to notify other components
        document.dispatchEvent(new Event('balanceUpdated'));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const handleOpenRegistrationModal = () => {
            handleOpenAuth('register');
        };

        document.addEventListener('openRegistrationModal', handleOpenRegistrationModal);
        return () => {
            document.removeEventListener('openRegistrationModal', handleOpenRegistrationModal);
        };
    }, []);



    return (
        <>
        <div className="header-container">
            <canvas ref={canvasRef} className="header-canvas"></canvas>
            <HeaderBackground />
            <header className="header">
            <div className="header-left">
                {/* Логотип */}
                <div className="logo">
                    <img src={logo} alt="XPOW Casino" className="logo-image" />
                </div>
                <OnlinePlayers />
                <img src={bonus} alt="Bonus" className="bonus-image" />
            </div>

            <div className={`header-center ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Главное меню */}
                <nav id="main-navigation" className="main-nav" aria-label="Main navigation">
                    <ul className={`nav-list ${mobileOpen ? 'open' : ''}`} ref={ulRef} onMouseLeave={handleMouseLeave}>
                        <li onMouseEnter={handleMouseEnter}><Link to={`/redirect?to=/home`} onClick={() => setMobileOpen(false)} className={`nav-link sparkle-hover ${location.pathname === '/home' ? 'nav-link-active' : ''}`}>Home</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to={`/redirect?to=/games`} onClick={() => setMobileOpen(false)} className="nav-link sparkle-hover">Casino</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to={`/redirect?to=/bonus`} onClick={() => setMobileOpen(false)} className="nav-link sparkle-hover">Free money</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to={`/redirect?to=/sports`} onClick={() => setMobileOpen(false)} className="nav-link sparkle-hover">Sports</Link></li>
                        <div className="nav-underline" style={{ width: underline.width + 'px', left: underline.left + 'px', opacity: underline.opacity }}></div>
                    </ul>
                </nav>

            </div>

            <div className="header-right">
                <button
                    className="mobile-toggle"
                    aria-controls="main-navigation"
                    aria-expanded={mobileOpen}
                    onClick={toggleMobile}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <rect x="3" y="6" width="18" height="2" rx="1"></rect>
                        <rect x="3" y="11" width="18" height="2" rx="1"></rect>
                        <rect x="3" y="16" width="18" height="2" rx="1"></rect>
                    </svg>
                </button>
                <div className="actions">
                    {isLoggedIn ? (
                        <>
                            <span className="balance-display">Balance: ${balance}</span>
                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-login" onClick={() => handleOpenAuth('login')}>Login</button>
                            <button className="btn-registration" onClick={() => handleOpenAuth('register')}>Registration</button>
                        </>
                    )}
                </div>

                {/* Дополнительное меню */}
                <div className="sub-nav">
                    <ul className="sub-list">
                <li>
                    <Link to={`/redirect?to=/home`} className="sub-link sub-link-1 sparkle-hover">Lobby</Link>
                </li>
                <li>
                    <Link to={`/redirect?to=/games`} className="sub-link sub-link-2 sparkle-hover">Live</Link>
                </li>
                <li>
                    <Link to={`/redirect?to=/games`} className="sub-link sub-link-3 sparkle-hover">Rapid</Link>
                </li>
                    </ul>
                </div>
            </div>
            </header>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={handleCloseAuth} mode={authMode} />
        </>
    );
}
