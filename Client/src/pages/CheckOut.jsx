import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form, Navbar, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Coupon from '../components/Coupon';
import { removeCartContext } from '../context/ContextShare';
import { addOrderApi, getCartItemApi } from '../services/allApi';
import { ServerURL } from '../services/baseUrl';
import axiosInstance from '../axios'
import './Checkout.css';
import '../App.css'

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

function CheckOut() {
  
  const userDetails = useSelector((state) => state.userDetails);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const { removeCart, setRemoveCart } = useContext(removeCartContext)
  const navigate = useNavigate();
  const [user, setUser] = useState()
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [address, setAddress] = useState({
    email: '',
    mobile: '',
    firstname: '',
    lastname: '',
    address_line_1: '',
    address_line_2: '',
    country: 'India',
    city: '',
    state: '',
    zip: '',
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/auth/user');
        console.log(response.data.data);
        setUser(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        email: user.email,
        mobile: user.phone,
        firstname: '',
        lastname: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
      }));
    }
  }, [user]);

  const getCartItems = async () => {
    setIsCartLoading(true);
    try {
      const ids = JSON.parse(localStorage.getItem('cartData')) || [];
      const params = new URLSearchParams();
      ids.forEach(id => params.append('id', id));
      const result = await getCartItemApi(params.toString());
      setCartItems(result?.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const validateField = (name, value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const mobileRegex = /^\d{10}$/;
    const zipRegex = /^\d{6}$/;

    switch (name) {
      case 'email':
        return !value ? 'Email is required' : !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'mobile':
        return !value ? 'Mobile number is required' : !mobileRegex.test(value) ? 'Please enter a valid 10-digit mobile number' : '';
      case 'firstname':
        return !value ? 'First name is required' : '';
      case 'lastname':
        return !value ? 'Last name is required' : '';
      case 'address_line_1':
        return !value ? 'Address is required' : '';
      case 'city':
        return !value ? 'City is required' : '';
      case 'state':
        return !value ? 'State is required' : '';
      case 'zip':
        return !value ? 'PIN code is required' : !zipRegex.test(value) ? 'Please enter a valid 6-digit PIN code' : '';
      default:
        return '';
    }
  };

  const discoutAmount = discountCode?.maxValue < ((subtotal * discount) / 100) ? discountCode?.maxValue : ((subtotal * discount) / 100);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(address).forEach(key => {
      const error = validateField(key, address[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = () => {
    if (validateForm()) {
      setIsLoading(true);
      handlePayment();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out all required fields correctly.',
      });
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const options = {
      // key: import.meta.env.VITE_APP_Razorpay_Api,
      key: 'rzp_test_wNhVz81BFxrIrL',
      amount: parseInt(subtotal - ((subtotal * discount) / 100) < 299 ? subtotal - ((subtotal * discount) / 100) + 79 : subtotal - ((subtotal * discount) / 100)) * 100,
      currency: 'INR',
      name: 'MELON MAGNETS',
      description: 'Purchase course',
      handler: function (response) {
        handlePaymentSuccess();
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        }
      },
      theme: {
        color: '#f9e7d2',
      },
      image: 'apple-touch-icon.png',
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = async () => {
    try {
      const products = JSON.parse(localStorage.getItem('cartData')) || [];
      const result = await addOrderApi({ ...address, products, amount: subtotal - ((subtotal * discount) / 100) < 299 ? subtotal - ((subtotal * discount) / 100) + 79 : subtotal - ((subtotal * discount) / 100), userId: userDetails?._id, couponId: discountCode._id });
      if (result.status === 201) {
        localStorage.setItem('cartData', JSON.stringify([]));
        setRemoveCart(prev => !prev);
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'An error occurred while processing your payment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    let subtotal = 0;
    cartItems.map(x => {
      subtotal += x.salePrice * x.quantity;
      return null;
    });
    setSubtotal(subtotal);
  }, [cartItems]);

  const calculatePercentageOff = (originalPrice, salePrice) => {
    const discount = originalPrice - salePrice;
    const percentageOff = (discount / originalPrice) * 100;
    return Math.round(percentageOff);
  };

  // if(!userDetails){
  //   useEffect(()=>{
  //     window.location.reload();
  //   },[])
  // }
  return (
    <>
      <HeaderContainer expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <HeaderLogo src='logo.png' alt="Company Logo" />
          </Navbar.Brand>
          <SecureText>
            <FaLock className="me-2" /> SECURE CHECKOUT
          </SecureText>
        </Container>
      </HeaderContainer>
      <div className="container my-5" style={{ position: 'relative', zIndex: '0' }}>
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div className='loader'></div>
          </div>
        )}
        <div className="row">
          <div className="col-md-7">
            <h2 className="mb-4">Checkout</h2>
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-3">Contact</h4>
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={address.email}
                      onChange={handleInputChange}
                      onBlur={handleInputChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                      id="mobile"
                      name="mobile"
                      value={address.mobile}
                      onChange={handleInputChange}
                      onBlur={handleInputChange}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>
                </form>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-3">Delivery</h4>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstname" className="form-label">
                        First name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                        id="firstname"
                        name="firstname"
                        value={address.firstname}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                      />
                      {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastname" className="form-label">
                        Last name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                        id="lastname"
                        name="lastname"
                        value={address.lastname}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                      />
                      {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address_line_1" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.address_line_1 ? 'is-invalid' : ''}`}
                      id="address_line_1"
                      name="address_line_1"
                      value={address.address_line_1}
                      onChange={handleInputChange}
                      onBlur={handleInputChange}
                    />
                    {errors.address_line_1 && <div className="invalid-feedback">{errors.address_line_1}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address_line_2" className="form-label">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address_line_2"
                      name="address_line_2"
                      value={address.address_line_2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                      />
                      {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="zip" className="form-label">
                        PIN code
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                        id="zip"
                        name="zip"
                        value={address.zip}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                      />
                      {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: '2rem' }}>
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h3 className="mb-4 text-center">Order Summary</h3>

                  {cartItems.map((item, index) => {
                    const originalPrice = item.price;
                    const salePrice = item.salePrice;
                    const percentageOff = calculatePercentageOff(originalPrice, salePrice);
                    return (
                      <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <img
                          src={item?.productId?.image && item?.productId?.image.length > 0 ? `${ServerURL}/uploads/${item?.productId?.image[0]}` : 'placeholder.jpg'}
                          className="img-fluid rounded me-3"
                          alt={item?.productId?.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{item?.productId?.name}</h6>
                          <div className="d-flex justify-content-between align-items-center mt-1">
                            <div>
                              <span className="fw-bold text-dark fw-bold">₹{salePrice}</span>
                              <span className="ms-2 text-muted text-decoration-line-through small">₹{originalPrice}</span>
                              <span className="ms-2 badge bg-success">{percentageOff}% off</span>
                            </div>
                            <span className="text-muted">Qty: {item?.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Coupon setDiscount={setDiscount} setDiscountCode={setDiscountCode} userId={userDetails} subtotal={subtotal} />

                  <div className="mt-4">
                    <h5 className="mb-3">Order Details</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount</span>
                      <span>-₹{discoutAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping</span>
                      <span>{subtotal - discoutAmount < 299 ? '₹79.00' : 'Free'}</span>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-3">
                      <h5>Total</h5>
                      <h5 className="text-dark fw-bold">₹{(subtotal - discoutAmount < 299 ?
                        subtotal - discoutAmount + 79 :
                        subtotal - discoutAmount).toFixed(2)}
                      </h5>
                    </div>
                  </div>
                  {userDetails ?
                    <button
                      type="button"
                      className="btn btn-warning btn-lg w-100 mt-4"
                      onClick={handleClick}
                      disabled={isLoading || isCartLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </button> :
                    <Link to={'/login'}>
                      <Button
                        type="button"
                        className="btn btn-warning btn-lg w-100 mt-4"
                      >
                        Proceed to Payment
                      </Button>
                    </Link>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOut;























// import React, { useEffect, useState } from 'react';
// import { ServerURL } from '../services/baseUrl';
// import './Checkout.css';
// import { addOrderApi, getCartItemApi } from '../services/allApi';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { useSelector } from 'react-redux';


// function CheckOut() {
//   const userDetails = useSelector((state) => state.userDetails);
//   // console.log('userDetails',userDetails);
//     const [cartItems, setCartItems] = useState([]);
//     const [subtotal, setSubtotal] = useState(0);
//     const navigate = useNavigate();
//     const [errors, setErrors] = useState({});
//     const [address, setAddress] = useState({
//       email: '',
//       mobile: '',
//       firstname: '',
//       lastname: '',
//       address_line_1: '',
//       address_line_2: '',
//       country: 'India',
//       city: '',
//       state: '',
//       zip: '',
//     });

//     const getCartItems = async () => {
//       const ids = JSON.parse(localStorage.getItem('cartData')) || [];
//       const params = new URLSearchParams();
//       ids.forEach(id => params.append('id', id));
//       const result = await getCartItemApi(params.toString());
//       setCartItems(result?.data);
//     };

//     const validate = () => {
//       const newErrors = {};
//       const emailRegex = /^\S+@\S+\.\S+$/;
//       const mobileRegex = /^\d{10}$/;
//       const zipRegex = /^\d{6}$/;

//       if (!address.email || !emailRegex.test(address.email)) newErrors.email = 'Please enter a valid email address';
//       if (!address.mobile || !mobileRegex.test(address.mobile)) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       if (!address.firstname) newErrors.firstname = 'First name is required';
//       if (!address.lastname) newErrors.lastname = 'Last name is required';
//       if (!address.address_line_1) newErrors.address_line_1 = 'Address line 1 is required';
//       if (!address.city) newErrors.city = 'City is required';
//       if (!address.state) newErrors.state = 'State is required';
//       if (!address.zip || !zipRegex.test(address.zip)) newErrors.zip = 'Please enter a valid 6-digit PIN code';
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     };


//     const handleClick = () => {
//       if (validate()) {
//         handlePayment();
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Validation Error',
//           text: 'Please fill out all required fields.',
//         });
//       }
//     };

//     useEffect(() => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       document.body.appendChild(script);
//       return () => {
//         document.body.removeChild(script);
//       };
//     }, []);

//     const handlePayment = () => {
//       const options = {
//         key: import.meta.env.VITE_APP_Razorpay_Api,
//         amount: parseInt(subtotal < 299 ? subtotal+79 : subtotal) * 100, // amount in paisa
//         currency: 'INR',
//         name: 'MELON MAGNETS',
//         description: 'Purchase course',
//         handler: function (response) {
//           handlePaymentSuccess();
//         },
//         theme: {
//           color: '#f9e7d2',
//         },
//         image: 'apple-touch-icon.png',
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     };

//     const handlePaymentSuccess = async () => {
//       const products = JSON.parse(localStorage.getItem('cartData')) || [];
//       console.log('cartData products',products);
//       const result = await addOrderApi({ ...address, products, amount: subtotal < 299 ? subtotal+79 : subtotal,userId:userDetails._id });
//       if (result.status === 201) {
//         localStorage.setItem('cartData', JSON.stringify([]));
//         Swal.fire({
//           icon: 'success',
//           title: 'Order Placed Successfully',
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         navigate('/');
//       }
//     };

//     useEffect(() => {
//       getCartItems();
//     }, []);

//     useEffect(() => {
//       let subtotal = 0;
//       cartItems.map(x => {
//         subtotal += x.price * x.quantity;
//         return null;
//       });
//       setSubtotal(subtotal);
//     }, [cartItems]);

//     const calculatePercentageOff = (originalPrice, salePrice) => {
//       const discount = originalPrice - salePrice;
//       const percentageOff = (discount / originalPrice) * 100;
//       return Math.round(percentageOff);
//     };

//     return (
//       <div className="container my-5" style={{ position: 'relative', zIndex: '0' }}>
//         <div className="row">
//           <div className="col-md-7">
//             <h2 className="mb-4">Checkout</h2>
//             <div className="card mb-4">
//               <div className="card-body">
//                 <h4 className="mb-3">Contact</h4>
//                 <form>
//                   <div className="mb-3">
//                     <label htmlFor="contact" className="form-label">
//                       Email
//                     </label>
//                     <input type="email" className="form-control" required id="contact" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
//                     {errors.email && <div className="text-danger">{errors.email}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="phone" className="form-label" >
//                       Phone
//                     </label>
//                     <input type="tel" className="form-control" required id="phone" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value })} />
//                     {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
//                   </div>
//                 </form>
//               </div>
//             </div>

//             <div className="card mb-4">
//               <div className="card-body">
//                 <h4 className="mb-3">Delivery</h4>
//                 <form>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="firstName" className="form-label">
//                         First name
//                       </label>
//                       <input type="text" className="form-control" id="firstName" value={address.firstname} onChange={(e) => setAddress({ ...address, firstname: e.target.value })} />
//                       {errors.firstname && <div className="text-danger">{errors.firstname}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="lastName" className="form-label">
//                         Last name
//                       </label>
//                       <input type="text" className="form-control" id="lastName" value={address.lastname} onChange={(e) => setAddress({ ...address, lastname: e.target.value })} />
//                       {errors.lastname && <div className="text-danger">{errors.lastname}</div>}
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="address" className="form-label">
//                       Address
//                     </label>
//                     <input type="text" className="form-control" id="address" value={address.address_line_1} onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })} />
//                     {errors.address_line_1 && <div className="text-danger">{errors.address_line_1}</div>}
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="apartment" className="form-label">
//                       Apartment, suite, etc.
//                     </label>
//                     <input type="text" className="form-control" id="apartment" value={address.address_line_2} onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })} />
//                   </div>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="city" className="form-label">
//                         City
//                       </label>
//                       <input type="text" className="form-control" id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
//                       {errors.city && <div className="text-danger">{errors.city}</div>}
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label htmlFor="state" className="form-label">
//                         State
//                       </label>
//                       <input type="text" className="form-control" id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
//                       {errors.state && <div className="text-danger">{errors.state}</div>}
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label htmlFor="pin" className="form-label">
//                         PIN code
//                       </label>
//                       <input type="text" className="form-control" id="pin" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
//                       {errors.zip && <div className="text-danger">{errors.zip}</div>}
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-5">
//             <div className="sticky-top">
//               <h2 className="mb-4">Order Summary</h2>
//               {cartItems.map((item, index) => {
//                        const originalPrice = item.productId.price;
//                        const salePrice = item.price;
//                        const percentageOff = calculatePercentageOff(originalPrice, salePrice);
//                 return(<div key={index} className="card mb-3 border-dark p-3 shadow">
//                   <div className="row g-0">
//                     <div className="col-md-4 col-5 d-flex align-items-center">
//                       <img
//                         src={item?.productId?.image && item?.productId?.image.length > 0 ? `${ServerURL}/uploads/${item?.productId?.image[0]}` : 'placeholder.jpg'}
//                         className="img-fluid rounded"
//                         alt={item?.productId?.name}
//                       />
//                     </div>
//                     <div className="col-md-8 col-7">
//                       <div className="card-body">
//                         <h5 className="card-title text-dark fw-bold">{item?.productId?.name}</h5>
//                         <p className="card-text fw-bold ">₹{item?.price}</p>
//                         <span className="m-1 text-muted text-decoration-line-through">₹{originalPrice}</span>
//                         <span className="text-success fw-bold bg-success-subtle p-1">{percentageOff}% off</span>
//                         <p className="card-text fw-bold ">Quantity: {item?.quantity}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>)
//                })}

//               <div className="mb-4">
//                 <label htmlFor="discountCode" className="form-label">
//                   Discount code
//                 </label>
//                 <div className="input-group">
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="discountCode"
//                     placeholder="Enter discount code"
//                   />
//                   <button className="btn btn-warning" type="button">
//                     Apply
//                   </button>
//                 </div>
//               </div>

//               <div className="card mb-4">
//                 <div className="card-body">
//                   <h5 className="mb-3">Order Total</h5>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Subtotal</span>
//                     <span>₹{subtotal}</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-3">
//                     <span>Shipping</span>
//                     <span>{subtotal < 299 ? '₹79' : 'Free'}</span>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <h5>Total</h5>
//                     <h5>₹{subtotal < 299 ? subtotal+79 : subtotal}</h5>
//                   </div>
//                   <div className="mt-3">
//                     <button type="button" className="btn btn-warning btn-block w-100" onClick={handleClick}>
//                       Proceed to Payment
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// }

// export default CheckOut;
