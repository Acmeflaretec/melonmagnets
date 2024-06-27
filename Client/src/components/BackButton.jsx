// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);  // Navigate to the previous page
  };

  return (
  <div className='container mt-2 d-flex justify-content-end mb-3'>
        <button className='btn btn-dark ' onClick={handleBackClick}>
        <i className="fa-solid fa-caret-left"></i> Back
        </button>
  </div>
  );
};

export default BackButton;
