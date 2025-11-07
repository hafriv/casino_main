import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import instagram from '../assets/social/instagram_icon.png';
import twitter from '../assets/social/twitter_icon.png';
import facebook from '../assets/social/facebook_icon.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bg"></div>
      <div className="container footer-inner">
        <div className="footer-left">
          <img src={logo} alt="XPOW Casino" className="ft-logo" />
          <p className="ft-desc">Играй ответственно. Служба поддержки 24/7.</p>
        </div>

        <nav className="footer-center" aria-label="Footer navigation">
          <ul className="footer-menu">
            <li><Link to={`/redirect?to=/home`}>Home</Link></li>
            <li><Link to={`/redirect?to=/games`}>Casino</Link></li>
            <li><Link to={`/redirect?to=/bonus`}>Free money</Link></li>
            <li><Link to={`/redirect?to=/sports`}>Sports</Link></li>
          </ul>
        </nav>

        <div className="footer-right">
          <div className="socials">
            <a href="#" aria-label="instagram"><img src={instagram} alt="instagram"/></a>
            <a href="#" aria-label="twitter"><img src={twitter} alt="twitter"/></a>
            <a href="#" aria-label="facebook"><img src={facebook} alt="facebook"/></a>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container legal-inner">
          <span>© 2025 XPOW Casino. All rights reserved.</span>
          <div className="legal-links">
            <Link to={`/redirect?to=/privacy`}>Privacy Policy</Link>
            <Link to={`/redirect?to=/terms`}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
