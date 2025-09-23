import React from 'react';
import './Header.css'; // или используй Tailwind

export default function Header() {
    return (
        <header className="header">
            {/* Логотип */}
            <div className="logo">
                <span className="brand">XPOW</span>
            </div>

            {/* Главное меню */}
            <nav className="main-nav">
                <ul className="nav-list">
                    <li><a href="#" className="nav-link">Home</a></li>
                    <li><a href="#" className="nav-link active">Casino</a></li>
                    <li><a href="#" className="nav-link">Free Money</a></li>
                    <li><a href="#" className="nav-link">Sports</a></li>
                </ul>
            </nav>

            {/* Правая часть: кнопки */}
            <div className="actions">
                <button className="btn-login">Login</button>
                <button className="btn-registration">Registration</button>
            </div>

            {/* Подменю (под казино) */}
            <div className="sub-nav">
                <ul className="sub-list">
                    <li><a href="#" className="sub-link active">Lobby</a></li>
                    <li><a href="#" className="sub-link">Live-games</a></li>
                    <li><a href="#" className="sub-link">Quick games</a></li>
                </ul>
            </div>
        </header>
    );
}