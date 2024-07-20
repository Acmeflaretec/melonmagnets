// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../axios';
// import { useNavigate } from 'react-router-dom';

// import { Col, Row } from 'react-bootstrap';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
// import Form from 'react-bootstrap/Form';
// import { Link } from 'react-router-dom';
// import logo from '../assets/img/logo.png';

// const Login = () => {
//   const [userDetails, setUserDetails] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
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

//         navigate('/')

//       }

//     } catch (error) {
//       console.error('Error during registration: ', error);
//     }
//   };


//   return (
//     <>
//       {/* <div className='bg-success-subtle'>
//         <div className='container p-3'>
//           <div className='d-flex justify-content-between align-items-center'>
//             <Link to={'/'}>
//               <div>
//                 <img src={logo} className='img-fluid' width={150} alt="" />
//               </div>
//             </Link>
//             <div>
//               <p className='d-none d-md-block fw-bold'>Discovering the incredibles of microgreens</p>
//             </div>
//             <div>
//               <div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}
//       <div className="container p-5 mt-5">
//         <div className="">
//           <Row>
//             <Col md={6} className='d-none d-md-block '>
//               <img
//                 src={logo}
//                 alt="" style={{ width: '100%' }}
//               />
//             </Col>
//             <Col className='shadow p-3' md={6}>
//               <div className='text-center'>
//                 <h3>Login</h3>
//                 <p> Unlocking Doors to Innovation </p>
//               </div>
//               <Form onSubmit={handleSubmit}>
//                 <div>

//                   <FloatingLabel
//                     controlId="floatingInput"
//                     label="Email address"
//                     className="mb-3"

//                   >
//                     <Form.Control type="email"
//                       name="email"
//                       placeholder="name@example.com"
//                       value={userDetails.email}
//                       required
//                       onChange={handleChange} />
                      
//                   </FloatingLabel>
//                   <FloatingLabel
//                     controlId="floatingPassword"
//                     label="Password"
//                     className="position-relative"
//                   >

//                     <Form.Control
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       name="password"
//                       required
//                       value={userDetails.password}
//                       onChange={handleChange}
//                     />
//                     <span
//                       className="position-absolute top-50 end-0 translate-middle-y me-3"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {showPassword ? '👁' : '👁‍🗨'}
//                     </span>
//                   </FloatingLabel>
//                   <div className='mt-3 d-flex justify-content-between align-items-center'>
//                     <button className='btn btn-outline-success'>Login</button>
//                     <span>
//                       new here?
//                       <Link to={'/register'} className='text-primary'>
//                         create account
//                       </Link>
//                     </span>
//                   </div>
//                 </div>
//               </Form>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;





import React, { useState } from 'react';
import axiosInstance from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { Col, Row, Form, FloatingLabel } from 'react-bootstrap';
import logo from '../assets/img/logo.png';
import GoogleLoginComponent from './GoogleLoginComponent';

const Login = () => {
  const [userDetails, setUserDetails] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axiosInstance.post('/api/v1/auth/login', userDetails);
  //     localStorage.setItem('Tokens', JSON.stringify({ access: response.data.token.accessToken, refresh: response.data.token.refreshToken }));
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error during login: ', error);
  //   }
  // };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axiosInstance.post('/api/v1/auth/login', userDetails);
          localStorage.setItem(
            "Tokens",
            JSON.stringify({ access: response.data.data.token.accessToken, refresh: response.data.data.token.refreshToken })
          );
    
          if (response.data) {
    
            navigate('/')
    
          }
    
        } catch (error) {
          console.error('Error during registration: ', error);
          alert('please check your email and password')
        }
      };

  return (
    <div className="container p-5 mt-5">
      <div className="">
        <Row>
          <Col md={6} className="d-none d-md-block">
            <img src={logo} alt="" style={{ width: '100%' }} />
          </Col>
          <Col className="shadow p-3" md={6}>
            <div className="text-center">
              <h3>Login</h3>
              
            </div>
            <Form onSubmit={handleSubmit}>
              <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={userDetails.email}
                  required
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Password" className="position-relative">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  required
                  value={userDetails.password}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </span>
              </FloatingLabel>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <button className="btn btn-outline-success">Login</button>
                <span>
                  new here? <Link to="/register" className="text-primary">create account</Link>
                </span>
              </div>
            </Form>
            <div className="text-center mt-3">
              <GoogleLoginComponent />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
