import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerURL } from '../services/baseUrl';
import { getCartItemApi, removeCartItemApi, updateCartItemApi } from '../services/allApi';
import '../App.css';
import { cartResponseContext, removeCartContext } from '../context/ContextShare';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [loading, setLoading] = useState(true);
  const { toggleCart, setToggleCart } = useContext(cartResponseContext);
  const { removeCart, setRemoveCart } = useContext(removeCartContext);
  const navigate = useNavigate();

  const getCartItems = async () => {
    const ids = JSON.parse(localStorage.getItem('cartData')) || [];
    const params = new URLSearchParams();
    ids.forEach(id => params.append('id', id));
    const result = await getCartItemApi(params.toString());
    setCartItems(result?.data);
    setLoading(false);
    const q = result?.data?.reduce((acc, x) => {
      acc[x._id] = x.quantity;
      return acc;
    }, {});
    setQuantity(q);
  };

  const handleQuantityChange = async (id, operation) => {
    const newQuantity = operation === 'increment' ? quantity[id] + 1 : quantity[id] - 1;
    setQuantity(prev => ({ ...prev, [id]: newQuantity }));
    await updateCartItemApi(id, newQuantity);
  };

  const handleRemoveItem = async (id) => {
    const result = await removeCartItemApi(id);
    if (result.status === 200) {
      const ids = JSON.parse(localStorage.getItem('cartData')) || [];
      const cartData = ids.filter(x => x !== id);
      const array = cartItems.filter(x => x._id !== id);
      setCartItems([...array]);
      localStorage.setItem('cartData', JSON.stringify(cartData));
      setRemoveCart(prev => !prev);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const calculatePercentageOff = (originalPrice, salePrice) => {
    const discount = originalPrice - salePrice;
    const percentageOff = (discount / originalPrice) * 100;
    return Math.round(percentageOff);
  };

  const handleAddProducts = () => {
    navigate('/allproducts');
    setToggleCart(false);
  };

  const handleCheckOut = () => {
    navigate('/checkout');
    setToggleCart(false);
  };

  let subtotal = 0;
  cartItems?.forEach(x => {
    subtotal += x?.price * quantity[x._id];
  });

  const discount = 0;
  const deliveryCharges = 0;

  const totalBeforeDiscount = subtotal;
  const totalAfterDiscount = totalBeforeDiscount - discount + deliveryCharges;

  return (
    <>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '60vh' }}>
          <div className='loader'></div>
        </div>
      ) : (
        <div className="my-5">
          {cartItems?.length === 0 ? (
            <div className="text-center">
              <p className="text-muted">No items in the cart</p>
              <button className="btn btn-warning" onClick={handleAddProducts}>
                <i className="fas fa-plus me-2"></i>Add Items
              </button>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                {cartItems?.map((item) => {
                  const originalPrice = item.productId.price;
                  const salePrice = item.price;
                  const percentageOff = calculatePercentageOff(originalPrice, salePrice);

                  return (
                    <div key={item.productId._id} className="card mb-3 border-dark p-3 shadow">
                      <div className="row g-0">
                        <div className="col-md-4 col-5 d-flex align-items-center">
                          <img
                            src={item?.productId?.image && item?.productId?.image.length > 0 ? `${ServerURL}/uploads/${item?.productId?.image[0]}` : 'placeholder.jpg'}
                            className="img-fluid rounded"
                            alt={item?.productId?.name}
                          />
                        </div>
                        <div className="col-md-8 col-7">
                          <div className="card-body">
                            <h5 className="card-title text-dark fw-bold">{item?.productId?.name}</h5>
                            <p className="card-text fw-bold ">₹{item?.price}</p>
                            <span className='m-1 text-muted text-decoration-line-through'>₹{originalPrice}</span>
                            <span className='text-success fw-bold bg-success-subtle p-1'>{percentageOff}% off</span>
                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div className="d-flex justify-content-center align-items-center">
                                <button
                                  className="btn btn-outline-success rounded-circle"
                                  onClick={() => handleQuantityChange(item._id, 'decrement')}
                                  disabled={quantity[item._id] === 1}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="mx-3 fw-bold">{quantity[item._id]}</span>
                                <button
                                  className="btn btn-outline-success rounded-circle"
                                  onClick={() => handleQuantityChange(item._id, 'increment')}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                              <button
                                className="btn btn-outline-danger rounded-pill ms-2"
                                onClick={() => handleRemoveItem(item._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-md-12">
                <div className="card border-dark p-3 shadow">
                  <h5 className="card-title text-dark fw-bold">Order Summary</h5>
                  <div className="d-flex justify-content-between mt-2">
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
                  <button className='btn btn-warning rounded-pill w-100' onClick={handleCheckOut}>Checkout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;
