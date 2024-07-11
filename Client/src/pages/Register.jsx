
import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

function Register() {
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

        navigate('/login')

      }

    } catch (error) {
      console.error('Error during registration: ', error);
      navigate('/register')
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <>
      {/* <div className='bg-success-subtle'>
        <div className='container p-3'>
          <div className='d-flex justify-content-between align-items-center'>
            <Link to={'/'}>
              <div>
                <img src={logo} className='img-fluid' width={150} alt="" />
              </div>
            </Link>
            <div>
              <p className='d-none d-md-block fw-bold'>Discovering the incredibles of microgreens</p>
            </div>
            <div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container p-5 mt-5 ">
        <div>
          <Row>

            <Col className='shadow p-3 ' md={6}>
              <div className='text-center'>
                <h3>Register</h3>
                <p> Unlocking Doors to Innovation </p>
              </div>
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="floatingname"
                  label="Username"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={userDetails.username}
                    onChange={handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPhone"
                  label="Phone number"
                  className="mb-3"
                >
                  <Form.Control
                    type="tel"
                    placeholder="123-456-7890"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPassword"
                  label="Password"
                  className="position-relative"
                >
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </span>
                </FloatingLabel>
                <div className='mt-3 d-flex justify-content-between align-items-center'>
                  <button className='btn btn-outline-success' type="submit">Sign Up</button>
                  <span>
                    Already a user?
                    <Link to={'/login'} className='text-primary'>
                      Login
                    </Link>
                  </span>
                </div>
              </Form>
            </Col>
            <Col md={6} className='d-none d-md-block '>
              <img
                src={logo}
                alt="" style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Register;
