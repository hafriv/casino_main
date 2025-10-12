import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Header() {
    return (
        <header className="header">
            {/* Логотип */}
            <div className="logo">
                <img src={logo} alt="XPOW Casino" className="logo-image" />
            </div>

            {/* Главное меню */}
            <nav className="main-nav">
                <ul className="nav-list">
                    <li> <Link to="/home" className="nav-link">Home</Link> </li>
                    <li> <Link to="/games" className="nav-link">Casino</Link> </li>
                    <li> <Link to="/bonus" className="nav-link">Free money</Link> </li>
                    <li> <Link to="/sports" className="nav-link">Sports</Link> </li>
                </ul>
            </nav>

            {/* Панель регистрации */}
            <div className="actions">
                <button className="btn-login">Login</button>
                <button className="btn-registration">Registration</button>
            </div>

            {/* Дополнительное меню */}
            <div className="sub-nav">
                <ul className="sub-list">
                    <li><Link to="/home" className="sub-link active">Lobby</Link></li>
                    <li><Link to="/games" className="sub-link">Live</Link></li>
                    <li><Link to="/games" className="sub-link">Rapid</Link></li>
                </ul>
            </div>
        </header>
    );
}
