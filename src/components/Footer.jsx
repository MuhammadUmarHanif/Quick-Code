import React from "react";
import { Link } from 'react-scroll';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="footer-container">
        
        {/* Logo and Copyright */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="QuickCode Logo" className="footer-logo-img" />
            <span className="footer-logo-text">QuickCode</span>
          </div>
          <p className="footer-copyright">© 2026 QuickCode. All rights reserved. Real-time collaboration made simple.</p>
        </div>

        {/* Links Column 1 */}
        <div className="footer-section">
          <h3 className="footer-heading">Navigation</h3>
          <nav className="footer-nav">
            <ul className="footer-list">
              <li>
                <Link to="hero" spy={true} smooth={true} offset={-100} duration={500}>Home</Link>
              </li>
              <li>
                <Link to="a1" spy={true} smooth={true} offset={-80} duration={500}>About</Link>
              </li>
              <li>
                <Link to="f1" spy={true} smooth={true} offset={-80} duration={500}>Features</Link>
              </li>
              <li>
                <Link to="faq-container" spy={true} smooth={true} offset={-80} duration={500}>FAQ</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Links Column 2 */}
        <div className="footer-section">
          <h3 className="footer-heading">More</h3>
          <nav className="footer-nav">
            <ul className="footer-list">
              <li>
                <Link to="hero" spy={true} smooth={true} offset={-100} duration={500}>Launch App</Link>
              </li>
              <li>
                <a href="mailto:contact@hanifumar169@gmail.com">Contact Support</a>
              </li>
            </ul>
          </nav>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
