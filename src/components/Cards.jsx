import React, { useState } from "react";
import "./Cards.css";

const TiltCard = ({ title, description }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Cap tilt angle to 10 degrees for elegant feel
    const rotX = -(y / (rect.height / 2)) * 10;
    const rotY = (x / (rect.width / 2)) * 10;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className="feature-tilt-card glass-panel"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out'
      }}
    >
      <div className="card-card-glow"></div>
      <h2 className="tilt-title" style={{ transform: 'translateZ(20px)' }}>{title}</h2>
      <p className="tilt-desc" style={{ transform: 'translateZ(10px)' }}>{description}</p>
    </div>
  );
};

const Cards = () => {
  return (
    <div className="cards-container-section">
      <section className="logos-section">
        <p className="logos-heading">
          Trusted and utilized by developers at top platforms and institutions
        </p>
        <div className="logos-wrapper glass-panel">
          <img src="./logos.png" alt="Trusted Brand Logos" className="brands-logo-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="brands-logo-fallback">
            <span>Google</span> • <span>Microsoft</span> • <span>Meta</span> • <span>MIT</span> • <span>Stanford</span>
          </div>
        </div>
      </section>
      
      <section className="features-section-cards">
        <div className="cards-perspective-grid">
          <TiltCard 
            title="Code with your team" 
            description="Open a QuickCode editor, write or copy code, and share the space with friends and colleagues. Pair program, debug, and troubleshoot problems together."
          />
          <TiltCard 
            title="Interview developers" 
            description="Set coding challenges and observe candidates code in real-time when conducting technical interviews remotely. Save time and get immediate validation."
          />
          <TiltCard 
            title="Teach people to program" 
            description="Broadcast your live editor to students, peers, and collaborators. Guide them in real-time and review syntax instantly. Used daily by educators."
          />
        </div>
      </section>
    </div>
  );
};

export default Cards;
