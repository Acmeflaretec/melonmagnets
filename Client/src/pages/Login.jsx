// import React, { useState } from 'react';
// import axiosInstance from '../axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Row, Col, Form, Button, Card ,Navbar } from 'react-bootstrap';
// import { motion } from 'framer-motion';
// import { FaEye, FaEyeSlash, FaGoogle ,FaLock  } from 'react-icons/fa';
// import styled from 'styled-components';
// import logo from '../assets/img/logo.png';

// const StyledCard = styled(Card)`
//   border-radius: 15px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//   overflow: hidden;
// `;

// const LogoContainer = styled.div`
//   background: linear-gradient(135deg, #fef1e0, #a777e3);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 100%;
// `;

// const Logo = styled.img`
//   max-width: 80%;
//   max-height: 80%;
// `;

// const FormContainer = styled.div`
//   padding: 3rem;
// `;

// const StyledInput = styled(Form.Control)`
//   border-radius: 30px;
//   padding: 0.75rem 1.5rem;
//   border: 1px solid #e0e0e0;
//   transition: all 0.3s ease;

//   &:focus {
//     box-shadow: 0 0 0 0.2rem rgba(110, 142, 251, 0.25);
//     border-color: #6e8efb;
//   }
// `;

// const StyledButton = styled(Button)`
//   border-radius: 30px;
//   padding: 0.75rem 2rem;
//   font-weight: bold;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   }
// `;

// const GoogleButton = styled(StyledButton)`
//   background-color: #ffffff;
//   color: #757575;
//   border: 1px solid #e0e0e0;

//   &:hover {
//     background-color: #f5f5f5;
//   }
// `;

// const HeaderContainer = styled(Navbar)`
//   background-color: #f8f9fa;
//   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// `;
// const HeaderLogo = styled.img`
//   height: 60px;
// `;
// const SecureText = styled.span`
//   font-weight: 600;
//   color: #28a745;
//   display: flex;
//   align-items: center;
// `;

// const Login = () => {
//   const [userDetails, setUserDetails] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post('/api/v1/auth/login', userDetails);
//       localStorage.setItem(
//         "Tokens",
//         JSON.stringify({ access: response.data.data.token.accessToken, refresh: response.data.data.token.refreshToken })
//       );

//       if (response.data) {
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error during login: ', error);
//       alert(error?.response?.data?.message ?? 'Please check your email and password');
//     }
//   };

//   return (

//    <>
//       <HeaderContainer expand="lg">
//       <Container>
//         <Navbar.Brand as={Link} to="/">
//           <HeaderLogo src='logo.png' alt="Company Logo" />
//         </Navbar.Brand>
//         <SecureText>
//           <FaLock className="me-2" /> Secure Registration
//         </SecureText>
//       </Container>
//     </HeaderContainer>
//       <Container className="mt-5">
//         <StyledCard>
//           <Row className="g-0">
//             <Col md={6} className="d-none d-md-block">
//               <LogoContainer>
//                 <Logo src='logo.png' alt="Company Logo" />
//               </LogoContainer>
//             </Col>
//             <Col md={6}>
//               <FormContainer>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <h2 className="text-center mb-4">Welcome Back</h2>
//                   <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-4">
//                       <StyledInput
//                         type="email"
//                         name="email"
//                         placeholder="Email address"
//                         value={userDetails.email}
//                         required
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-4 position-relative">
//                       <StyledInput
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="Password"
//                         name="password"
//                         required
//                         value={userDetails.password}
//                         onChange={handleChange}
//                       />
//                       <span
//                         className="position-absolute top-50 end-0 translate-middle-y me-3"
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                       </span>
//                     </Form.Group>
//                     <StyledButton variant="primary" type="submit" className="w-100 mb-3">
//                       Log In
//                     </StyledButton>
//                   </Form>
//                   <div className="text-center mb-3">
//                     <span>or</span>
//                   </div>
//                   <GoogleButton variant="light" className="w-100 mb-3">
//                     <FaGoogle className="me-2" /> Log in with Google
//                   </GoogleButton>
//                   <div className="text-center mt-3">
//                     <span>
//                       New here? <Link to="/register" className="text-primary">Create an account</Link>
//                     </span>
//                   </div>
//                 </motion.div>
//               </FormContainer>
//             </Col>
//           </Row>
//         </StyledCard>
//       </Container>
//    </>
//   );
// };

// export default Login;




import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Navbar, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import GoogleLoginComponent from './GoogleLoginComponent';

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

const GoogleButton = styled(StyledButton)`
  background-color: #ffffff;
  color: #757575;
  border: 1px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
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

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  cursor: pointer;
  top: 200px;

  @media (min-width: 576px) {
    top: 200px;
  }
  @media (min-width: 768px) {
    top: 205px;
  }
  @media (min-width: 992px) {
    top: 210px;
  }
`;

const Login = () => {
  const [userDetails, setUserDetails] = useState({ number: '', otp: '' });
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disab, setDisab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSendOtp = async () => {
    try {
      if (userDetails.number.length === 10) {
        setLoading(true);
        await axiosInstance.post('/api/v1/auth/send-otp', { number: userDetails.number });
        setShowOtpField(true);
        setResendTimer(60);
        setDisab(true)
      } else {
        alert('Phone Number Must Be 10 Digits');
      }

    } catch (error) {
      console.error('Error sending OTP: ', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/v1/auth/verify-otp', { number: userDetails.number, otp: userDetails.otp });
      localStorage.setItem(
        "Tokens",
        JSON.stringify({ access: response.data.data.token.accessToken, refresh: response.data.data.token.refreshToken })
      );

      if (response.data) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Error during login: ', error);
      alert(error?.response?.data?.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
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
                {/* <HeaderLogo src='logo.png' alt="Company Logo" /> */}
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
                  <h2 className="text-center mb-4">Welcome Back</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <StyledInput
                        type="text"
                        name="number"
                        placeholder="Enter your mobile number"
                        value={userDetails.number}
                        required
                        onChange={handleChange}
                        disabled={disab}
                      />
                    </Form.Group>
                    {showOtpField && (
                      <>
                        <Form.Group className="mb-4">
                          <StyledInput
                            type='text'
                            placeholder="Enter OTP"
                            name="otp"
                            required
                            value={userDetails.otp}
                            onChange={handleChange}
                          />
                          {/* <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </EyeIcon> */}
                        </Form.Group>
                        <Button variant="link" onClick={handleResendOtp} disabled={resendTimer > 0}>
                          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                        </Button>
                        <StyledButton variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Verify OTP'}
                        </StyledButton>
                      </>
                    )}
                  </Form>
                  {!showOtpField && (
                    <StyledButton variant="primary" onClick={handleSendOtp} className="w-100 mb-3" disabled={loading}>
                      {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send OTP'}
                    </StyledButton>
                  )}
                  <div className="text-center mb-3">
                    <span>or</span>
                  </div>
                  {/* <GoogleButton variant="light" className="w-100 mb-3">
                    <FaGoogle className="me-2" /> Log in with Google
                  </GoogleButton> */}
                  <GoogleLoginComponent />
                </motion.div>
              </FormContainer>
            </Col>
          </Row>
        </StyledCard>
      </Container>
    </>
  );
};

export default Login;
