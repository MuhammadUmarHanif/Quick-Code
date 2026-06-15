import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What can I use Quick Code for?",
      answer:
        "Quick Code is ideal for collaborative work, pair programming, technical interviews, hosting classes or workshops, sharing code snippets, or debugging problems in real-time with colleagues.",
    },
    {
      question: "Is login required to join a room?",
      answer:
        "No. You can join and collaborate in any room without registering or logging in. You simply need the shared Room ID and a nickname.",
    },
    {
      question: "How do I run and compile my code?",
      answer:
        "Quick Code features an integrated compiler interface powered by Judge0 APIs. Simply choose your programming language from the dropdown menu and press 'Run Code' to execute and view stdout/stderr output.",
    },
    {
      question: "Can everyone in the room see code edits?",
      answer:
        "Yes, all edits are transmitted in real-time to every user currently connected to the same Room ID using modern WebSocket architecture.",
    },
    {
      question: "Is there voice communication available?",
      answer:
        "Yes, we have integrated voice channels directly inside each room. As long as you give browser permission, you can talk with your team while editing code.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section-wrapper" id="faq-container">
      <div className="faq-container glass-panel">
        <div className="faq-header">
          <HelpCircle size={32} className="faq-header-icon" />
          <h1>Frequently Asked Questions</h1>
          <p className="description">
            Got questions about how Quick Code works? We've got answers. If you need further support, feel free to{" "}
            <a href="mailto:contact@hanifumar169@gmail.com">contact us</a>.
          </p>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                className={`faq-item ${isOpen ? 'active' : ''}`} 
                key={index}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-q-text">{item.question}</span>
                  <button className="faq-toggle-btn" aria-label="Toggle answer">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </div>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="faq-answer">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
