import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BulkOrder.css';

function BulkOrder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    magnets: false,
    pinbadges: false,
    message: ''
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to server or perform other actions
    console.log(formData);
    // Reset form after submission (optional)
    setFormData({
      name: '',
      email: '',
      phone: '',
      quantity: '',
      magnets: false,
      pinbadges: false,
      message: ''
    });
  };

  return (
    <div>
      <div className="container mt-5 bulk-order-container">
        <div className="form-header">
          <h2>Bulk Order Form</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              id="phone" 
              placeholder="Enter your phone number" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input 
              type="number" 
              className="form-control" 
              id="quantity" 
              placeholder="Enter quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3 form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="magnets" 
              checked={formData.magnets} 
              onChange={handleChange} 
            />
            <label className="form-check-label" htmlFor="magnets">Square Magnets</label>
          </div>
          <div className="mb-3 form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="pinbadges" 
              checked={formData.pinbadges} 
              onChange={handleChange} 
            />
            <label className="form-check-label" htmlFor="pinbadges">Square Pin Badges</label>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea 
              className="form-control" 
              id="message" 
              rows="3" 
              placeholder="Add a message" 
              value={formData.message} 
              onChange={handleChange} 
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BulkOrder;
