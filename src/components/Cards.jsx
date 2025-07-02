import React from "react";
import "./Cards.css";

const Cards = () => {
  return (
    <div className="container">
      <section className="logos-section">
        <p className="logos-heading">
          Used by software engineers at companies and universities we respect
          and admire.
        </p>
        <div className="logos">
          <img src="./logos.png" alt="All" />
        </div>
      </section>
      <section className="features-section">
        <div className="feature">
          <h2>Code with your team</h2>
          <p>
            Open a QuickCode editor, write or copy code, then share it with
            friends and colleagues. Pair program and troubleshoot together.
          </p>
        </div>
        <div className="feature">
          <h2>Interview developers</h2>
          <p>
            Set coding tasks and observe in real-time when interviewing remotely
            or in person. Nobody likes writing code on a whiteboard.
          </p>
        </div>
        <div className="feature">
          <h2>Teach people to program</h2>
          <p>
            Share your code with students and peers then educate them.
            Universities and colleges around the world use QuickCode every day.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Cards;
