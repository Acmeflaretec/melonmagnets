import React, { useEffect, useState } from 'react';
import './topnav.css'

function Topnav() {
  const messages = [
    'Premium Quality ',
    'Free shipping all over India ',
    'Whatsapp +91 8618012964',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  const nextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
  };


  return (
    <div className="custom-nav-bar mt-3">
      <div className="nav-arrow" onClick={prevMessage}> &lt; </div>
      <div className="nav-content">
        <div className="slider" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
          {messages.map((message, index) => (
            <span className="nav-text" key={index}>
              {message}
            </span>
          ))}
        </div>
      </div>
      <div className="nav-arrow" onClick={nextMessage}> &gt; </div>
    </div>
  );
}

export default Topnav;