import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ServerURL } from '../services/baseUrl';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize state from local storage
    const storedCartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    return storedCartItems;
  });

  useEffect(() => {
    // Store cart items in local storage whenever they are updated
    if (cartItems.length > 0) {
      localStorage.setItem('cartData', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartData');
    }
  }, [cartItems]);

  const handleQuantityChange = (productName, operation) => {
    setCartItems(prevCartItems =>
      prevCartItems.map(item =>
        item.productDetails.name === productName
          ? {
              ...item,
              quantity:
                operation === 'increment'
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 1),
              totalPrice:
                operation === 'increment'
                  ? (item.quantity + 1) * item.productDetails.price
                  : Math.max(item.quantity - 1, 1) * item.productDetails.price,
            }
          : item
      )
    );
  };
  

  const handleRemoveItem = (productName) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.productDetails.name !== productName)
    );
  };
  

  const subtotal = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  const discount = 300;
  const deliveryCharges = 300;

  const totalBeforeDiscount = subtotal;
  const totalAfterDiscount = totalBeforeDiscount - discount - deliveryCharges;

  return (
    <div className="my-5">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No items in the cart</p>
          <Link to={'/'}>
            <button className="btn btn-warning">
              <i className="fas fa-plus me-2"></i>Add Items
            </button>
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            {cartItems.map(item => (
              <div key={item.productDetails.name} className="card mb-3 border-dark p-3 shadow">
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
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex justify-content-center align-items-center ">
                        <button
                            className="btn btn-outline-success rounded-circle"
                            onClick={() => handleQuantityChange(item.productDetails.name, 'decrement')}
                            disabled={item.quantity === 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-outline-success rounded-circle"
                            onClick={() => handleQuantityChange(item.productDetails.name, 'increment')}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <div>
                        <button
                          className="btn btn-outline-danger rounded-pill ms-2"
                          onClick={() => handleRemoveItem(item.productDetails.name)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-12">
            <div className="card border-dark p-3 shadow">
              <h5 className="card-title text-dark fw-bold">Order Summary</h5>
              <div className="d-flex justify-content-between">
                <p>Subtotal:</p>
                <p>₹{subtotal}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Discount:</p>
                <p>-₹{discount}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Delivery Charges:</p>
                <p>₹{deliveryCharges}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p>Total:</p>
                <p>₹{totalAfterDiscount}</p>
              </div>
              <Link to={'/checkout'}>
                <button className='btn btn-warning rounded-pill w-100'>Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
