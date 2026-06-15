import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Sparkles, Terminal, Code2, Users, Radio, MessageSquare, Play } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  // 3D Card Hover Rotation State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Generated new Room ID');
  };

  const createroom = () => {
    if (!roomId || !username) {
      toast.error('Room ID & Username are required');
      return;
    }
    setShowModal(false);
    setShowModal1(false);
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  const handleInputEnter = (e) => {
    if (e.key === 'Enter') {
      createroom();
    }
  };

  return (
    <>
      <section className="hero" id="hero">
        <div className="ambient-glow glow-blue"></div>
        <div className="ambient-glow glow-purple"></div>

        <div className="hero-container-layout">
          <div className="hero-text-side">
            <div className="pill-badge">
              <Sparkles size={14} className="accent-color" />
              <span>Quick Code</span>
            </div>
            
            <h1 className="hero-title">
              Share <span>Code</span> in Real-Time with <br />
              <span className="change-content"></span>
            </h1>
            
            <p className="hero-subtitle">
              Quick Code is a collaborative online workspace for technical interviews, pair programming, and interactive coding. Zero setup required.
            </p>

            <div className="hero-buttons">
              <button className="btn-join" onClick={() => { setRoomId(''); setUsername(''); setShowModal(true); }}>
                Join Room
              </button>
              <button className="btn-create" onClick={() => { setRoomId(''); setUsername(''); setShowModal1(true); }}>
                Create Room <ArrowRight size={18} />
              </button>
            </div>

            <div className="no-login-tag">
              <span>⚡ No sign up or credentials required to collaborate.</span>
            </div>
          </div>

          <div className="hero-graphics-side">
            <div className="3d-perspective-box">
              {/* Interactive 3D Editor Preview Card */}
              <div 
                className="mock-editor-card glass-panel"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {/* Window top bar */}
                <div className="editor-top-bar" style={{ transform: 'translateZ(20px)' }}>
                  <div className="dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="tab">
                    <Code2 size={14} className="tab-icon" />
                    <span>QuickCodeApp.js</span>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="editor-body" style={{ transform: 'translateZ(10px)' }}>
                  <pre className="code-lines">
                    <code>
                      <span className="keyword">import</span> React, &#123; useState &#125; <span className="keyword">from</span> <span className="string">'react'</span>;<br />
                      <span className="keyword">import</span> &#123; Socket &#125; <span className="keyword">from</span> <span className="string">'socket.io'</span>;<br /><br />
                      <span className="comment">// Real-Time Collaborative Sync</span><br />
                      <span className="keyword">function</span> <span className="function">collaborate</span>(user) &#123;<br />
                      &nbsp;&nbsp;console.<span className="function">log</span>(<span className="string">`$&#123;user&#125; joined code editor!`</span>);<br />
                      &nbsp;&nbsp;<span className="keyword">return</span> <span className="boolean">true</span>;<br />
                      &#125;<br />
                    </code>
                  </pre>
                </div>

                {/* Floating 3D Badge on top of Card */}
                <div className="floating-editor-badge glass-panel" style={{ transform: 'translateZ(35px)' }}>
                  <Users size={16} className="badge-icon" />
                  <span>3 Developers Syncing...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Logo Roller tapes */}
      <section className="roller">
        <div className="slider">
          <div className="slide-track">
            {/* Double the logos to make it infinite scrolling */}
            {[
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/node-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/express-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/figma-icon.svg",
              "https://img.icons8.com/?size=100&id=20906&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=13662&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=Z7NfqP21BfNn&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=63785&format=png&color=000000",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/node-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/express-js-icon.svg",
              "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/figma-icon.svg",
              "https://img.icons8.com/?size=100&id=20906&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=13662&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=Z7NfqP21BfNn&format=png&color=000000",
              "https://img.icons8.com/?size=100&id=63785&format=png&color=000000"
            ].map((src, index) => (
              <div className="slide" key={index}>
                <img src={src} alt="Tech Brand Icon" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Info / About section */}
      <section className="about" id="a1">
        <div className="about-layout-container">
          <div className="section-header-centered">
            <h2>REAL-TIME CODE WORKSPACE</h2>
            <p className="subtitle">Fully loaded workspace for developers and educators</p>
          </div>

          <div className="about-grid">
            <div className="about-item">
              <div className="about-graphic glass-panel">
                <img src="/png.png" alt="Code Workspace Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                <Terminal size={120} className="fallback-art-icon" />
              </div>
              <div className="about-text">
                <h3>Collaborative Code Editor</h3>
                <p>
                  Write and debug code together with your peers. Changes are broadcast instantaneously to all connections within the workspace. Perfect for pair programming.
                </p>
              </div>
            </div>

            <div className="about-item reverse">
              <div className="about-graphic glass-panel">
                <img src="/login.png" alt="Workspace Join Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                <Radio size={120} className="fallback-art-icon" />
              </div>
              <div className="about-text">
                <h3>Real-Time Sync Rooms</h3>
                <p>
                  Join rooms instantly via custom-generated Room IDs. Sync code, output logs, inputs, and compiler results globally with your teammates instantly.
                </p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-graphic glass-panel">
                <img src="https://codefile.io/_next/image?url=%2Fpreferred_language.png&w=640&q=75" alt="Language Syntax Select" onError={(e) => { e.target.style.display = 'none'; }} />
                <Code2 size={120} className="fallback-art-icon" />
              </div>
              <div className="about-text">
                <h3>Language Compilation</h3>
                <p>
                  Select from over 10+ major coding environments. Write programs with fully integrated compiler APIs, instant output logging, and standard error handling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Grid Section */}
      <section className="features-showcase" id="f1">
        <div className="section-header-centered">
          <h2>Core Features</h2>
          <p className="subtitle">Everything you need to collaborate effectively</p>
        </div>

        <div className="features-grid">
          {[
            { icon: <Code2 size={32} />, title: "Live Code Synced", desc: "Collaborative edits synchronized instantly across all connections." },
            { icon: <Terminal size={32} />, title: "Code Compilation", desc: "Compile programs instantly using built-in high-performance runner APIs." },
            { icon: <Radio size={32} />, title: "Instant Join Rooms", desc: "Share Room IDs to let teammates join instantly without log in steps." },
            { icon: <MessageSquare size={32} />, title: "Voice Call Synced", desc: "Integrated voice calls inside rooms so you can speak while editing." },
            { icon: <Users size={32} />, title: "Unlimited Users", desc: "Highly optimized sockets supporting multiple candidates in a single room." }
          ].map((feat, idx) => (
            <div className="feature-card glass-panel" key={idx}>
              <div className="feat-icon">{feat.icon}</div>
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modals for Join & Create Rooms */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              className="room-modal glass-panel"
              initial={{ opacity: 0, scale: 0.85, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateX: -10 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>

              <div className="room-modal-body">
                <h2>Join Workspace</h2>
                <p className="room-modal-sub">Enter invite credentials to join a live workspace session</p>
                
                <input
                  type="text"
                  className="input-field"
                  placeholder="ROOM ID"
                  onChange={(e) => setRoomId(e.target.value)}
                  value={roomId}
                  onKeyUp={handleInputEnter}
                />
                
                <input
                  type="text"
                  className="input-field"
                  placeholder="USERNAME"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  onKeyUp={handleInputEnter}
                />

                <button className="room-action-btn" onClick={createroom}>
                  Join Session <Play size={14} style={{ marginLeft: 5 }} />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showModal1 && (
          <div className="modal-overlay" onClick={() => setShowModal1(false)}>
            <motion.div 
              className="room-modal glass-panel"
              initial={{ opacity: 0, scale: 0.85, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateX: 10 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal1(false)}>
                <X size={20} />
              </button>

              <div className="room-modal-body">
                <h2>Create Workspace</h2>
                <p className="room-modal-sub">Start a new shared editor room and invite your team</p>

                <input
                  type="text"
                  className="input-field"
                  placeholder="ROOM ID"
                  onChange={(e) => setRoomId(e.target.value)}
                  value={roomId}
                  onKeyUp={handleInputEnter}
                />
                
                <input
                  type="text"
                  className="input-field"
                  placeholder="USERNAME"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  onKeyUp={handleInputEnter}
                />

                <button className="room-action-btn" onClick={createroom}>
                  Create Room <Play size={14} style={{ marginLeft: 5 }} />
                </button>

                <div className="create-room-help">
                  <span>No Room ID? </span>
                  <a href="./" onClick={createNewRoom}>Generate ID</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
