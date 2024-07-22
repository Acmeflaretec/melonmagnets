import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import logo from '../assets/img/logo.png';

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LogoContainer = styled.div`
  background: linear-gradient(135deg, #fef1e0, #a777e3);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Logo = styled.img`
  max-width: 80%;
  max-height: 80%;
`;

const FormContainer = styled.div`
  padding: 3rem;
`;

const StyledInput = styled(Form.Control)`
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(110, 142, 251, 0.25);
    border-color: #6e8efb;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 30px;
  padding: 0.75rem 2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderContainer = styled(Navbar)`
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
const HeaderLogo = styled.img`
  height: 60px;
`;
const SecureText = styled.span`
  font-weight: 600;
  color: #28a745;
  display: flex;
  align-items: center;
`;

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/v1/auth/register', userDetails);
      console.log('Registration successful: ', response.data.data);

      if (response.data.data) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during registration: ', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
<>
        <HeaderContainer expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">
        <HeaderLogo src='logo.png' alt="Company Logo" />
      </Navbar.Brand>
      <SecureText>
        <FaLock className="me-2" /> Secure Registration
      </SecureText>
    </Container>
  </HeaderContainer>
      <Container className="mt-5">
        <StyledCard>
          <Row className="g-0">
            <Col md={6} className="d-none d-md-block">
              <LogoContainer>
                <Logo src='logo.png' alt="Company Logo" />
              </LogoContainer>
            </Col>
            <Col md={6}>
              <FormContainer>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-center mb-4">Create an Account</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <StyledInput
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={userDetails.username}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <StyledInput
                        type="email"
                        placeholder="Email address"
                        name="email"
                        value={userDetails.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <StyledInput
                        type="tel"
                        placeholder="Phone number"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-4 position-relative">
                      <StyledInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={userDetails.password}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </Form.Group>
                    <StyledButton variant="primary" type="submit" className="w-100 mb-3">
                      Sign Up
                    </StyledButton>
                  </Form>
                  <div className="text-center mt-3">
                    <span>
                      Already have an account? <Link to="/login" className="text-primary">Log in</Link>
                    </span>
                  </div>
                </motion.div>
              </FormContainer>
            </Col>
          </Row>
        </StyledCard>
      </Container>
</>
  );
};

export default Register;