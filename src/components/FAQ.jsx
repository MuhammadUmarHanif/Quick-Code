import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What can I use Quick Code for?",
      answer:
        "You can use Quick Code for everything code sharing, like pair programming, share code online with your team, tech interviews, teaching... you name it.",
    },
    {
      question: "Login Is Must Required For Join Room?",
      answer:
        "No You Can Join Room Without Login Or Signup. You Just Need Of Room Id.",
    },
    {
      question: "How i Can Compile Code In QickCode?",
      answer: "There Is A Built in Compiler.You Can Compile Code Within Code Editor.",
    },
    {
        question: "EveryOne Can See the Changings Of Code?",
        answer: "YES Everyone Can See The Changings of Code In Real-Time.",
      },
      {
        question: "Can We Communicate with Others?",
        answer: "YES You Can Communicate With Others Via Voice Communication.",
      },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>FAQ</h1>
      <p className="description">
        Here you can find most frequent asked questions. Feel free to{" "}
        <a href="mailto:contact@hanifumar169@gmai.com">contact me</a> if you still have a different one.
      </p>
      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <div
            className="faq-question"
            onClick={() => toggleFAQ(index)}
          >
            <span>{item.question}</span>
            <button>{activeIndex === index ? "-" : "+"}</button>
          </div>
          {activeIndex === index && <p className="faq-answer">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
