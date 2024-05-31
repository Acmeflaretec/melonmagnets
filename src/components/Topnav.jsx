import React, { useEffect, useState } from 'react';
import './topnav.css'

function Topnav() {
  const messages = [
    'Any questions? Text us now (201) 252-9478',
    'Need help? Call us at (202) 123-4567',
    'Support available 24/7 at (303) 987-6543',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  const nextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
  };


  return (
    <div className="container custom-nav-bar mt-3">
      <div className="nav-arrow" onClick={prevMessage}> &lt; </div>
      <div className="nav-content">
        <div className="slider" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
          {messages.map((message, index) => (
            <span className="nav-text" key={index}>
              <i className="phone-icon">&#128222;</i> {/* Unicode character for phone icon */}
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