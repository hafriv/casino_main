import React from 'react';
import './header.css';
import {
    BrowserRouter as Router,
    Route,
    Link,
} from 'react-router-dom';

export default function Header() {
    return (
        <Router>
            <header className="header">
                {/* Логотип */}
                <div className="logo">
                    <span className="brand">XPOW</span>
                </div>

                {/* Главное меню */}
                <nav className="main-nav">
                    <ul className="nav-list">
                        <li> <Link to="/" className="nav-link">Home</Link> </li>
                        <li> <Link to="/casino" className="nav-link">Casino</Link> </li>
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
                        <li><Link to="/" className="sub-link active">Lobby</Link></li>
                        <li><Link to="/casino" className="sub-link">Live games</Link></li>
                        <li><Link to="/casino" className="sub-link">Quick games</Link></li>
                    </ul>
                </div>
            </header>
        </Router>

    );
}