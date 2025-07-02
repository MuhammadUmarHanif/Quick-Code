import React ,{useState} from "react";
import './HeroSection.css';
import './Editor.jsx';
import { motion } from 'framer-motion';
import { fadeIn } from '../veriant';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const HeroSection = () => {
  const navigate = useNavigate();
  const [showModal1, setShowModal1]=useState(false);
  const [showModal, setShowModal]=useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
};


const createroom = () => {
  if (!roomId || !username) {
      toast.error('ROOM ID & username is required');
      return;
  }
  setShowModal1(false); // Close modal
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
        <div className="hero-content">
          <h1 className="hero-title">
            SHARE <span>CODE</span> WITH <span className="change-content"></span>
          </h1>
          <p className="hero-subtitle">
            Quick Code is a collaborative online code editor for technical interviews, pair programming, teaching... you name it.
          </p>

          <div className="hero-buttons">
          <button className="join-room"  onClick={()=> setShowModal(true)}>
              Join &#43;
              </button>
            <button className="create-room"  onClick={()=> setShowModal1(true)}>
              Create &#10162;
              </button>
          </div>
            {/* join Room Modal Popup */}
       {showModal && (
        <div className="modal-overlay-create">
          
          <div className="modal-content-create">
          <div className="createlogo">
      <img src="/joinroom.png" alt=""/>
    </div>
            <h2>Quick Code </h2>
            <p> Code, Chat, Collaborate. It's All in Sync</p>
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
          <button className="createRoom-btn" onClick={createroom}>
              Join
          </button>
          <button className="close-btn" onClick={() => setShowModal(false)}>
            close
          </button>
       </div>
       </div>
)}
          
       {/* create Room Modal Popup */}
       {showModal1 && (
        <div className="modal-overlay-create">
          
          <div className="modal-content-create">
          <div className="createlogo">
      <img src="/createroom.png" alt=""/>
    </div>
            <h2>Quick Code </h2>
            <p> Code, Chat, Collaborate. It's All in Sync</p>
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
          <button className="createRoom-btn" onClick={createroom}>
              Join
          </button>
          <button className="close-btn" onClick={() => setShowModal1(false)}>
            close
          </button>
          <div className="createInfo">
          <span className="createInfo">
              If you don't have an invite then create &nbsp;
              <a
                  onClick={createNewRoom}
                  href="./"
                  className="createNewBtn"
              >
                  new room
              </a>
          </span>
          </div>
          </div>
        </div>
      )}

          <h3>NO NEED TO LOGIN AND SIGNUP</h3>
        </div>
        <div className="blob">
        </div>
        <div className="hero-image">
        <img src="/3d logo.png" alt="3D Logo" />
        </div>
      </section>
      <section className="roller">
      <div className="slider">
  <div className="slide-track">
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tinder-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/figma-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.svg" alt="" />
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/node-js-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/express-js-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/adobe-illustrator-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=64&id=XCNhMfBsqfX1&format=png" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=74402&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=63785&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=Z7NfqP21BfNn&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=13662&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=20906&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tinder-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/figma-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.svg" alt="" />
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/node-js-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/express-js-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/adobe-illustrator-icon.svg" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=64&id=XCNhMfBsqfX1&format=png" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=74402&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=63785&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=Z7NfqP21BfNn&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=13662&format=png&color=000000" alt=""/>
    </div>
    <div className="slide">
      <img src="https://img.icons8.com/?size=100&id=20906&format=png&color=000000" alt=""/>
    </div>
  </div>
</div>
      </section>
      <section className="about" id="a1">
        <div className="hero2">
          <h1>REAL-TIME CODE EDITOR</h1>
          <motion.div 
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          className="pic">
            <img src="/png.png" alt="Real-time editor visual" />
          </motion.div>
          
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="text"
          >
            <h2>Real-Time Editor</h2>
            <p>
              Edit code and see updates while collaborating with other users in real-time. It allows multiple developers to write, edit, and debug code simultaneously.
            </p>
          </motion.div>
          <div className="new">
          <motion.div 
           variants={fadeIn("left", 0.2)}
           initial="hidden"
           whileInView="show"
           viewport={{ once: false, amount: 0.2 }}
          className="join">
        <img src="/login.png" alt="Real-time editor visual" />
        </motion.div>
        <motion.div 
         variants={fadeIn("right", 0.2)}
         initial="hidden"
         whileInView="show"
         viewport={{ once: false, amount: 0.2 }}
          className="newp">
        <p>
          This is the Join Page for a real-time code collaboration platform called  QUICK Code.Join Room Via Unique Room id And userName to Enter in Real-Time Code Editor
          </p>
          </motion.div>
          </div>
        <div className="language">
        <motion.div 
         variants={fadeIn("right", 0.2)}
         initial="hidden"
         whileInView="show"
         viewport={{ once: false, amount: 0.7 }}
         className="clr">
          <img src="https://codefile.io/_next/image?url=%2Fpreferred_language.png&w=640&q=75" alt="" />
          </motion.div>
<motion.div 
 variants={fadeIn("left", 0.2)}
 initial="hidden"
 whileInView="show"
 viewport={{ once: false, amount: 0.7 }}className="clr2">
          <h2>
          Syntax highlighting in your preferred language.
          </h2>
        <p>
        Choose among 120+ programming languages to adapt your file syntax.
        </p>
        </motion.div>
        </div>
        </div>
        
      </section>

      <section className="features" id="f1">
      <motion.div 
       variants={fadeIn("up", 0.1)}
           initial="hidden"
           whileInView="show"
           viewport={{ once: false, amount: 0.7 }}
           className="main">
        <div  className="card">
        <img src="f1.png" alt="" />
          <p>Real-Time Collaborative Code Edit At a Same Time.</p>
        </div>
        <div className="card">
        <img src="f2.png" alt=""  />
          <p>This Tool Is Specially Made For Students And Developers .</p>
        </div>
        <div  className="card">
        <img src="f3.png" alt=""  />
          <p>Join Via Room Id No Need Of Login And Signup.</p>
        </div>
        <div className="card">
        <img src="f4.png" alt=""  />
          <p>Real-Time Voice Communication And Code Compilation .</p>
        </div>
       <div
        className="card">
       <img src="f5.png" alt=""  />
          <p>Unlimited Candidated Can Join One Room At A Time.</p>
        </div>
      </motion.div>
    </section>
   
    </>
  );
};

export default HeroSection;
