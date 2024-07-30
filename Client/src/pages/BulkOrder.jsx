import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { createBulkOrderApi } from "../services/allApi";
import Swal from "sweetalert2";
import styled from "styled-components";
import { FaBox, FaEnvelope, FaPhone, FaUser, FaCommentAlt } from "react-icons/fa";
import '../App.css'

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
  position: relative;
`;

const Banner = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('banner.jpg');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const StyledInput = styled(Form.Control)`
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    border-color: #80bdff;
  }
`;

const StyledNumberInput = styled(StyledInput)`
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const StyledTextArea = styled(StyledInput)`
  width: 100%;
  min-height: 120px;
  resize: vertical;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  background-color: #007bff;
  border-color: #007bff;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
    background-color: #0056b3;
    border-color: #0056b3;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FormLabel = styled(Form.Label)`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  color: #007bff;
`;

function BulkOrder() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    quantity: "",
    product: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      const errors = validateForm();
      setFormErrors(errors);
    }
  }, [formData, isSubmitted]);

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

    if (isSubmitted) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[id];
      setFormErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const result = await createBulkOrderApi({ ...formData });
        console.log(result);
        Swal.fire({
          title: "Order Received!",
          text: `Thank you, ${result.data.data.name}! We appreciate your bulk order request for ${result.data.data.quantity} ${result.data.data.product}. We will reach out to you within 24 hours to finalize the details and provide you with a quote.`,
          icon: "success",
          confirmButtonColor: "#007bff",
        });
        setFormData({
          name: "",
          email: "",
          mobile: "",
          quantity: "",
          product: "",
          message: "",
        });
        setIsSubmitted(false);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while submitting your order. Please try again.",
          icon: "error",
          confirmButtonColor: "#007bff",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email.trim())) errors.email = "Invalid email format";
    if (!mobileRegex.test(formData.mobile.trim())) errors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.quantity.trim() || parseInt(formData.quantity) < 10) errors.quantity = "Quantity must be at least 10";
    if (!formData.product) errors.product = "Please select a product";
    if (!formData.message.trim()) errors.message = "Message is required";

    return errors;
  };

  return (
    <>
      <Banner>
        <h1>Bulk Order Request</h1>
      </Banner>
      <Container className="my-5">
        <StyledCard>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Bulk Order Form</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <FormLabel><IconWrapper><FaUser /></IconWrapper>Name</FormLabel>
                    <StyledInput
                      type="text"
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!formErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <FormLabel><IconWrapper><FaEnvelope /></IconWrapper>Email</FormLabel>
                    <StyledInput
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!formErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <FormLabel><IconWrapper><FaPhone /></IconWrapper>Mobile Number</FormLabel>
                    <StyledInput
                      type="tel"
                      id="mobile"
                      placeholder="Enter your mobile number (10 digits)"
                      value={formData.mobile}
                      onChange={handleChange}
                      isInvalid={!!formErrors.mobile}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.mobile}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <FormLabel><IconWrapper><FaBox /></IconWrapper>Quantity</FormLabel>
                    <StyledNumberInput
                      type="number"
                      id="quantity"
                      placeholder="Enter quantity (minimum 10)"
                      value={formData.quantity}
                      onChange={handleChange}
                      isInvalid={!!formErrors.quantity}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.quantity}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <FormLabel>Products</FormLabel>
                <div>
                  <Form.Check
                    inline
                    type="checkbox"
                    id="magnets"
                    label="Square Magnets"
                    checked={formData.product === "magnets"}
                    onChange={handleChange}
                    isInvalid={!!formErrors.product}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    id="pinbadges"
                    label="Square Pin Badges"
                    checked={formData.product === "pinbadges"}
                    onChange={handleChange}
                    isInvalid={!!formErrors.product}
                  />
                </div>
                {formErrors.product && <div className="text-danger mt-2">{formErrors.product}</div>}
              </Form.Group>
              <Form.Group className="mb-4">
                <FormLabel><IconWrapper><FaCommentAlt /></IconWrapper>Message</FormLabel>
                <StyledTextArea
                  as="textarea"
                  id="message"
                  rows={4}
                  placeholder="Add any additional details or requirements for your bulk order"
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!formErrors.message}
                />
                <Form.Control.Feedback type="invalid">{formErrors.message}</Form.Control.Feedback>
              </Form.Group>
              <div className="text-center">
                <StyledButton type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Bulk Order Request"
                  )}
                </StyledButton>
              </div>
            </Form>
          </Card.Body>
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
             <div className='loader'></div>
            </div>
          )}
        </StyledCard>
      </Container>
    </>
  );
}

export default BulkOrder;