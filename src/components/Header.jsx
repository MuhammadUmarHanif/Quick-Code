import React, { useState } from "react";
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, ArrowRight, House, List, MessageCircle, Rocket, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullname, setfullname] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", username, password);
    setShowModal(false);
  };

  const handleSignup = () => {
    console.log("Signup with:", fullname, username, password);
    setShowModal1(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header glass-panel">
      <div className="header-logo-container">
        <div className="header-logo">
          <img src='/logo.png' alt="Quick Code Logo" className="header-logo-img" />
          <span className="header-logo-text">QUICK CODE</span>
        </div>
      </div>

      {/* Hamburger Button for Mobile */}
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation menu */}
      <nav className={menuOpen ? "open" : ""}>
        <ul>
          <li>
            <Link to="hero" spy={true} smooth={true} offset={-100} duration={500} onClick={() => setMenuOpen(false)}>
              <House size={16} className="nav-icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="a1" spy={true} smooth={true} offset={-80} duration={500} onClick={() => setMenuOpen(false)}>
              <MessageCircle size={16} className="nav-icon" /> About
            </Link>
          </li>
          <li>
            <Link to="f1" spy={true} smooth={true} offset={-80} duration={500} onClick={() => setMenuOpen(false)}>
              <List size={16} className="nav-icon" /> Features
            </Link>
          </li>
          <li>
            <Link to="faq-container" spy={true} smooth={true} offset={-80} duration={500} onClick={() => setMenuOpen(false)}>
              <Rocket size={16} className="nav-icon" /> FAQs
            </Link>
          </li>
        </ul>
      </nav>

      {/* Authentication Buttons */}
      <div className={`auth-buttons ${menuOpen ? "open" : ""}`}>
        <button className="login-btn" onClick={() => { setShowModal(true); setMenuOpen(false); }}>
          <LogIn size={16} /> Log In
        </button>
        <button className="signup-btn" onClick={() => { setShowModal1(true); setMenuOpen(false); }}>
          Sign Up <ArrowRight size={16} />
        </button>
      </div>

      {/* Modals using Framer Motion */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              className="modal-content glass-panel"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-body-layout">
                <div className="modal-artwork">
                  <img src="/loginlogo.png" alt="Login Graphic" onError={(e) => { e.target.style.display = 'none'; }} />
                  <LogIn size={64} className="fallback-art-icon" />
                </div>
                <div className="modal-form">
                  <h2>Welcome Back</h2>
                  <p className="modal-subtitle">Log in to sync your collaborative coding spaces</p>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                  <div className="modal-actions">
                    <button className="action-btn submit-btn" onClick={handleLogin}>
                      Log In
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showModal1 && (
          <div className="modal-overlay" onClick={() => setShowModal1(false)}>
            <motion.div 
              className="modal-content glass-panel"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal1(false)}>
                <X size={20} />
              </button>

              <div className="modal-body-layout">
                <div className="modal-artwork">
                  <img src="/signup.png" alt="Signup Graphic" onError={(e) => { e.target.style.display = 'none'; }} />
                  <ArrowRight size={64} className="fallback-art-icon" />
                </div>
                <div className="modal-form">
                  <h2>Create Account</h2>
                  <p className="modal-subtitle">Get advanced features for saving code rooms</p>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setfullname(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="input-field"
                  />
                  <div className="modal-actions">
                    <button className="action-btn submit-btn" onClick={handleSignup}>
                      Signup
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
