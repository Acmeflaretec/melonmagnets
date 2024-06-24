import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BulkOrder.css";
import { createBulkOrderApi } from "../services/allApi";
import Swal from "sweetalert2";

function BulkOrder() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "", // Changed from 'phone' to 'mobile'
    quantity: "",
    product: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    mobile: "", // Changed from 'phone' to 'mobile'
    quantity: "",
    product: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "magnets" || id === "pinbadges") {
      setFormData((prevState) => ({
        ...prevState,
        product: checked ? id : "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (
      !formData.mobile.trim() ||
      !isValidPhoneNumber(formData.mobile.trim())
    ) {
      errors.mobile = "Valid mobile number is required"; // Changed from 'phone' to 'mobile'
      isValid = false;
    }

    if (
      !formData.quantity.trim() ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) < 10
    ) {
      errors.quantity = "Quantity must be a number and minimum 10";
      isValid = false;
    }

    if (!formData.product) {
      errors.product = "Please select a product";
      isValid = false;
    }

    if (formData.message.trim().length === 0) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      const result = await createBulkOrderApi({ ...formData });
      Swal.fire({
        text: `Thank you, ${result.data.data.name}! We appreciate your bulk order request for ${result.data.data.quantity} ${result.data.data.product}.We will reach out to you within 24 hours to finalize the details and provide you with a quote.`,
        icon: "success",
      });
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        mobile: "", // Changed from 'phone' to 'mobile'
        quantity: "",
        product: "",
        message: "",
      });
    }
  };

  // Function to validate mobile number format
  const isValidPhoneNumber = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/; // Matches 10 digits
    return mobileRegex.test(mobile);
  };

  return (
    <div>
      <div>
        <img
          src="banner.jpg"
          alt=""
          className="mt-2"
          fluid
          style={{ width: "100%" }}
        />
      </div>
      <div className="container mt-5 bulk-order-container">
        <div className="form-header">
          <h2>Bulk Order Form</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.name && "is-invalid"}`}
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.name}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${formErrors.email && "is-invalid"}`}
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.email}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>{" "}
            {/* Changed from 'phone' to 'mobile' */}
            <input
              type="tel"
              className={`form-control ${formErrors.mobile && "is-invalid"}`}
              id="mobile"
              placeholder="Enter your mobile number (10 digits)"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.mobile}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity (minimum 10)
            </label>
            <input
              type="number"
              className={`form-control ${formErrors.quantity && "is-invalid"}`}
              id="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.quantity}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Products</label>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="magnets"
                value="magnets"
                checked={formData.product === "magnets"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="magnets">
                Square Magnets
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pinbadges"
                value="pinbadges"
                checked={formData.product === "pinbadges"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="pinbadges">
                Square Pin Badges
              </label>
            </div>
            <div className="invalid-feedback d-block">{formErrors.product}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              className={`form-control ${formErrors.message && "is-invalid"}`}
              id="message"
              rows="3"
              placeholder="Add a message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <div className="invalid-feedback">{formErrors.message}</div>
          </div>
          <button type="submit" className="btn btn-primary submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default BulkOrder;
