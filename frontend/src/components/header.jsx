import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Granim from 'granim';
import logo from '../assets/logo.png';

export default function Header() {
    const location = useLocation();
    const [underline, setUnderline] = useState({ width: 0, left: 0, opacity: 0 });
    const ulRef = useRef(null);
    const canvasRef = useRef(null);
    // const [rightUnderline, setRightUnderline] = useState({ width: 0, left: 0, opacity: 0 });
    // const ulRightRef = useRef(null);

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

    // Header background - just for styling
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
            </div>

            <div className="header-center">
                {/* Главное меню */}
                <nav className="main-nav">
                    <ul className="nav-list" ref={ulRef} onMouseLeave={handleMouseLeave}>
                        <li onMouseEnter={handleMouseEnter}><Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'nav-link-active' : ''}`}>Home</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to="/games" className="nav-link">Casino</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to="/bonus" className="nav-link">Free money</Link></li>
                        <li onMouseEnter={handleMouseEnter}><Link to="/sports" className="nav-link">Sports</Link></li>
                        <div className="nav-underline" style={{ width: underline.width + 'px', left: underline.left + 'px', opacity: underline.opacity }}></div>
                    </ul>
                </nav>
            </div>

            <div className="header-right">
                {/* Панель регистрации */}
                <div className="actions">
                    <button className="btn-login">Login</button>
                    <button className="btn-registration">Registration</button>
                </div>

                {/* Дополнительное меню */}
                <div className="sub-nav">
                    <ul className="sub-list">
                <li>
                    <Link to="/home" className="sub-link sub-link-1">Lobby</Link>
                </li>
                <li>
                    <Link to="/games" className="sub-link sub-link-2">Live</Link>
                </li>
                <li>
                    <Link to="/games" className="sub-link sub-link-3">Rapid</Link>
                </li>
                    </ul>
                </div>
            </div>
            </header>
        </div>
        </>
    );
}
