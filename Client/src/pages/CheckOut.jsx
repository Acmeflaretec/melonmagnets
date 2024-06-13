import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { ServerURL } from '../services/baseUrl';

function CheckOut() {
    const [cartItems, setCartItems] = useState([]);
    const [contactDetails, setContactDetails] = useState({
      email: '',
      phone: '',
    });
    const [addressDetails, setAddressDetails] = useState({
      firstname: '',
      lastname: '',
      address: '',
      appartment: '',
      city: '',
      state: '',
      pin: '',
    });
  
    const [payment, setPayment] = useState('cod'); // Default to Cash on Delivery
  
    useEffect(() => {
      // Retrieve cart items from local storage when component mounts
      const storedCartItems = JSON.parse(localStorage.getItem('cartData')) || [];
      setCartItems(storedCartItems);
    }, []);
  
    const subtotal = cartItems.reduce((total, item) => total + item.productDetails.price * item.quantity, 0);
  
    const handlePaymentChange = (e) => {
      setPayment(e.target.value);
    };
  
  return (
    <div className="container my-5" style={{ position: 'relative' , zIndex:'0'}}>
      <div className="row">
        <div className="col-md-7">
          <h2 className="mb-4">Checkout</h2>
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-3">Contact</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">
                    Email 
                  </label>
                  <input type="email" className="form-control" id="contact" value={contactDetails.email} onChange={(e)=>setContactDetails({...contactDetails,email:e.target.value})} />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone  
                  </label>
                  <input type="tel" className="form-control" id="phone"  value={contactDetails.phone} onChange={(e)=>setContactDetails({...contactDetails,phone:e.target.value})} />
                </div>
                {/* <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="newsOffers"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="newsOffers">
                    Email me with news and offers
                  </label>
                </div> */}
              </form>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-3">Delivery</h4>
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First name 
                    </label>
                    <input type="text" className="form-control" id="firstName" value={addressDetails.firstname} onChange={(e)=>setAddressDetails({...addressDetails,firstname:e.target.value})}/>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last name
                    </label>
                    <input type="text" className="form-control" id="lastName" value={addressDetails.lastname} onChange={(e)=>setAddressDetails({...addressDetails,lastname:e.target.value})}/>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input type="text" className="form-control" id="address" value={addressDetails.address} onChange={(e)=>setAddressDetails({...addressDetails,address:e.target.value})}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="apartment" className="form-label">
                    Apartment, suite, etc.
                  </label>
                  <input type="text" className="form-control" id="apartment" value={addressDetails.appartment} onChange={(e)=>setAddressDetails({...addressDetails,appartment:e.target.value})}/>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input type="text" className="form-control" id="city" value={addressDetails.city} onChange={(e)=>setAddressDetails({...addressDetails,city:e.target.value})} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input type="text" className="form-control" id="state" value={addressDetails.state} onChange={(e)=>setAddressDetails({...addressDetails,state:e.target.value})} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="pin" className="form-label">
                      PIN code
                    </label>
                    <input type="text" className="form-control" id="pin" value={addressDetails.pin} onChange={(e)=>setAddressDetails({...addressDetails,pin:e.target.value})}/>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="sticky-top">
            <h2 className="mb-4">Order Summary</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="card mb-3 border-dark p-3 shadow">
                <div className="row g-0">
                  <div className="col-md-4 col-5 d-flex align-items-center">
                    <img
                      src={item?.productDetails?.image && item?.productDetails?.image.length > 0 ? `${ServerURL}/uploads/${item?.productDetails?.image[0]}` : 'placeholder.jpg'}
                      className="img-fluid rounded"
                      alt={item?.productDetails?.name}
                    />
                  </div>
                  <div className="col-md-8 col-7">
                    <div className="card-body">
                      <h5 className="card-title text-dark fw-bold">{item?.productDetails?.name}</h5>
                      <p className="card-text fw-bold ">₹{item?.totalPrice}</p>
                      <span className='m-1 text-muted text-decoration-line-through'>₹999</span>
                      <span className='text-success fw-bold bg-success-subtle p-1'>70% off</span>
                      <p className="card-text fw-bold ">Quantity: {item?.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <label htmlFor="discountCode" className="form-label">
                Discount code
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="discountCode"
                  placeholder="Enter discount code"
                />
                <button className="btn btn-warning" type="button">
                  Apply
                </button>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">Order Total</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Total</h5>
                  <h5>₹{subtotal}</h5>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-3">Payment</h4>
                <form>
                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={payment === 'cod'}
                        onChange={handlePaymentChange}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="razorpay"
                        name="paymentMethod"
                        value="razorpay"
                        checked={payment === 'razorpay'}
                        onChange={handlePaymentChange}
                      />
                      <label className="form-check-label" htmlFor="razorpay">
                        Razorpay
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-warning btn-block">
                    Proceed to Payment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
