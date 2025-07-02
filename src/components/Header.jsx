import React, { useState } from "react";
import { Link } from 'react-scroll';
import './Header.css'; 
import { LogIn } from 'lucide-react';
import {ArrowRight} from 'lucide-react';
import { House } from 'lucide-react';
import { List } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Rocket } from 'lucide-react';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fullname, setfullname] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", username, password);
    // Add your authentication logic here
    setShowModal(false);
  };
  const handleSignup = () => {
    console.log("Signup with:", fullname, username, password);
    // Add your authentication logic here
    setShowModal(false);
  };
  return (
    <header className="header">
      <div className="logo">
        <img src='logo.png' alt="" className="logo-img" /> QUICK CODE
      </div>
      <nav>
        <ul>
          <li><Link to="/" > <div className='home'>
          <House />
            </div>Home</Link></li>
          <li><Link to="about"
      spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>
        <div className="about1">
        <MessageCircle /></div>About</Link></li>
      <li><Link to="features"
      spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>
        <div className='lists'><List /></div>Features</Link></li>
          <li><Link to="faq-container" spy={true}
      smooth={true}
      hashSpy={true}
      offset={50}
      duration={500}>
        <div className="faqs1"><Rocket /></div>FAQs</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
      {/* Log In Button */}
      <button className="login-btn" onClick={() => setShowModal(true)}>
        <LogIn /> Log In
      </button>

      {/* Sign Up Button */}
      <button className="signup-btn" onClick={() => setShowModal1(true)}>
        Sign Up <ArrowRight />
      </button>

      {/* Login Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          
          <div className="modal-content">
          <div className="loginlogo">
      <img src="/loginlogo.png" alt=""/>
    </div>
            <h2>Login</h2>
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
            <button className="login-btn1" onClick={handleLogin}>
              Log In
            </button>
            <button className="close-btn1" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    
     {/* signup Modal Popup */}
     {showModal1 && (
        <div className="modal-overlay">
          
          <div className="modal-content2">
          <div className="signuplogo">
      <img src="/signup.png" alt=""/>
    </div>
            <h2>signup</h2>
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
            <button className="signup-btn1" onClick={handleSignup}>
              Signup
            </button>
            <button className="close-btn2" onClick={() => setShowModal1(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </header>
  );
};

export default Header;
