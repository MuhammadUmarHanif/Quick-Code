import React from "react";
import "./Footer.css";
import { Link } from 'react-scroll';
const Footer = () => {
  return (
   
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">Links</h3>
          <nav >
          <ul className="footer-list" >
            <li><Link to="hero" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>Home</Link></li>
            <li><Link to="features" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>Features</Link></li>
            <li><Link to="faq-container" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>FAQ</Link></li>
            <li><Link to="about" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>About</Link></li>
          </ul>
          </nav>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">More</h3>
          <nav>
          <ul className="footer-list">
            <li><Link to="auth-buttons" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>Sign in →</Link></li>
      <li><Link to="auth-buttons" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>+ Login</Link></li>
          </ul>
          </nav>
        </div>
        
        <div className="footer-section footer-logo">
          <div>
            <span className="footer-logo-icon"><img src="logo.png" alt="" /></span> <span className="p">QuickCode</span>
          </div>
          <p>© 2024 QuickCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
    
  );
};

export default Footer;
