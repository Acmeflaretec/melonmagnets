import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Topnav from '../components/Topnav';
import NavBar from '../components/NavBar';
import './BulkOrder.css';

function BulkOrder() {
  return (
    <div>
      <Topnav />
      <NavBar />
      <div className="container mt-5 bulk-order-container">
        <div className="form-header">
          <h2>Bulk Order Form</h2>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your name" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="number" className="form-control" id="quantity" placeholder="Enter quantity" />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="magnets" />
            <label className="form-check-label" htmlFor="magnets">Square Magnets</label>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="pinbadges" />
            <label className="form-check-label" htmlFor="pinbadges">Square Pin Badges</label>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="3" placeholder="Add a message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BulkOrder;
