import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ServerURL } from '../services/baseUrl';
import { getCartItemApi, removeCartItemApi, updateCartItemApi } from '../services/allApi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [quantity,setquantity] = useState({})


  const getCartItems = async()=>{
    const ids = JSON.parse(localStorage.getItem('cartData')) || [];
    const params = new URLSearchParams();
    ids.forEach(id => params.append('id', id));
     const result = await getCartItemApi(params.toString())
     setCartItems(result?.data)
     const q = result?.data?.reduce((acc, x) => {
      acc[x._id] = x.quantity;
      return acc;
    }, {});
         setquantity(q)
     }

  const handleQuantityChange = async(id,operation) => {
     if(operation==='increment'){
       setquantity(prev=>({...prev,[id]:prev[id]+1}))
      const result = await updateCartItemApi(id,quantity[id]+1)
      console.log(result);
     }else{
      setquantity(prev=>({...prev,[id]:prev[id]-1}))
      const result = await updateCartItemApi(id,quantity[id]-1)
     }
  };
  

  const handleRemoveItem = async(id) => {
    const result = await removeCartItemApi(id)
    if(result.status==200){
      const ids = JSON.parse(localStorage.getItem('cartData')) || [];
      const cartData = ids.filter(x=>x!=id)
      const array = cartItems.filter(x=>x._id!=id)
      console.log(array);
      setCartItems([...array])
      localStorage.setItem('cartData', JSON.stringify(cartData))
    }
  };
  
  useEffect(()=>{
    getCartItems()
    console.log(cartItems);
  },[])
  useEffect(()=>{
    console.log(cartItems);
  },[cartItems])

   let subtotal = 0;
    cartItems?.map(x=>{
     subtotal+= x?.price*quantity[x._id]
    })
 

  const discount = 0;
  const deliveryCharges = 0;

  const totalBeforeDiscount = subtotal;
  const totalAfterDiscount = totalBeforeDiscount - discount + deliveryCharges;

  return (
    <div className="my-5">
      {cartItems?.length === 0 ? (
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
            {cartItems?.map((item , index) => (
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
                      <span className='m-1 text-muted text-decoration-line-through'>₹999</span>
                      <span className='text-success fw-bold bg-success-subtle p-1'>70% off</span>
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex justify-content-center align-items-center ">
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
                        <div>
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
