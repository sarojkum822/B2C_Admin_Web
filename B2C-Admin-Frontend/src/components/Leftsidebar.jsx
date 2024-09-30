import React, { useState } from 'react';


import headlogo from '../assets/headlogo.png';
import s1 from '../assets/s1.png';
import s2 from '../assets/s2.png';
import s3 from '../assets/s3.png';
import s4 from '../assets/s4.png';
import s5 from '../assets/s5.png';      
import './Leftsidebar.css';

const Leftsidebar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const icons = [s1, s2, s3, s4, s5];

  const handleIconClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="leftsidebar">
      <div className="logo">
        <img src={headlogo} className="logo-image" alt="Logo" />
      </div>
      {icons.map((icon, index) => (
        <div 
          className={`sidebaritem ${activeIndex === index ? 'active' : ''}`} 
          key={index} 
          onClick={() => handleIconClick(index)}
        >
          <img 
            src={icon} 
            className="subicon" 
            alt={`Sidebar icon ${index + 1}`} 
          />
        </div>
      ))}
    </div>
  );
};

export default Leftsidebar;
