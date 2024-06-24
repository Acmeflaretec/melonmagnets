// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);  // Navigate to the previous page
  };

  return (
  <div className='container mt-2 '>
        <button className='btn btn-light' onClick={handleBackClick}>
        <i className="fa-solid fa-arrow-left"></i>
        </button>
  </div>
  );
};

export default BackButton;
