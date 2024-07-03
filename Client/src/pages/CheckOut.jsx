import React, { useEffect, useState } from 'react';
import { ServerURL } from '../services/baseUrl';
import './Checkout.css';
import { addOrderApi, getCartItemApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CheckOut() {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
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

    const getCartItems = async () => {
      const ids = JSON.parse(localStorage.getItem('cartData')) || [];
      const params = new URLSearchParams();
      ids.forEach(id => params.append('id', id));
      const result = await getCartItemApi(params.toString());
      setCartItems(result?.data);
    };

    const validate = () => {
      const newErrors = {};
      const emailRegex = /^\S+@\S+\.\S+$/;
      const mobileRegex = /^\d{10}$/;
      const zipRegex = /^\d{6}$/;

      if (!address.email || !emailRegex.test(address.email)) newErrors.email = 'Please enter a valid email address';
      if (!address.mobile || !mobileRegex.test(address.mobile)) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      if (!address.firstname) newErrors.firstname = 'First name is required';
      if (!address.lastname) newErrors.lastname = 'Last name is required';
      if (!address.address_line_1) newErrors.address_line_1 = 'Address line 1 is required';
      if (!address.city) newErrors.city = 'City is required';
      if (!address.state) newErrors.state = 'State is required';
      if (!address.zip || !zipRegex.test(address.zip)) newErrors.zip = 'Please enter a valid 6-digit PIN code';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };


    const handleClick = () => {
      if (validate()) {
        handlePayment();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fill out all required fields.',
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
        key: import.meta.env.VITE_APP_Razorpay_Api,
        amount: parseInt(subtotal < 299 ? subtotal+79 : subtotal) * 100, // amount in paisa
        currency: 'INR',
        name: 'MELON MAGNETS',
        description: 'Purchase course',
        handler: function (response) {
          handlePaymentSuccess();
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
      const products = JSON.parse(localStorage.getItem('cartData')) || [];
      const result = await addOrderApi({ ...address, products, amount: subtotal < 299 ? subtotal+79 : subtotal });
      if (result.status === 201) {
        localStorage.setItem('cartData', JSON.stringify([]));
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
      }
    };

    useEffect(() => {
      getCartItems();
    }, []);

    useEffect(() => {
      let subtotal = 0;
      cartItems.map(x => {
        subtotal += x.price * x.quantity;
        return null;
      });
      setSubtotal(subtotal);
    }, [cartItems]);

    const calculatePercentageOff = (originalPrice, salePrice) => {
      const discount = originalPrice - salePrice;
      const percentageOff = (discount / originalPrice) * 100;
      return Math.round(percentageOff);
    };

    return (
      <div className="container my-5" style={{ position: 'relative', zIndex: '0' }}>
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
                    <input type="email" className="form-control" required id="contact" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label" >
                      Phone
                    </label>
                    <input type="tel" className="form-control" required id="phone" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value })} />
                    {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
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
                      <label htmlFor="firstName" className="form-label">
                        First name
                      </label>
                      <input type="text" className="form-control" id="firstName" value={address.firstname} onChange={(e) => setAddress({ ...address, firstname: e.target.value })} />
                      {errors.firstname && <div className="text-danger">{errors.firstname}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last name
                      </label>
                      <input type="text" className="form-control" id="lastName" value={address.lastname} onChange={(e) => setAddress({ ...address, lastname: e.target.value })} />
                      {errors.lastname && <div className="text-danger">{errors.lastname}</div>}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input type="text" className="form-control" id="address" value={address.address_line_1} onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })} />
                    {errors.address_line_1 && <div className="text-danger">{errors.address_line_1}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="apartment" className="form-label">
                      Apartment, suite, etc.
                    </label>
                    <input type="text" className="form-control" id="apartment" value={address.address_line_2} onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input type="text" className="form-control" id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                      {errors.city && <div className="text-danger">{errors.city}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <input type="text" className="form-control" id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                      {errors.state && <div className="text-danger">{errors.state}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="pin" className="form-label">
                        PIN code
                      </label>
                      <input type="text" className="form-control" id="pin" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                      {errors.zip && <div className="text-danger">{errors.zip}</div>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="sticky-top">
              <h2 className="mb-4">Order Summary</h2>
              {cartItems.map((item, index) => {
                       const originalPrice = item.productId.price;
                       const salePrice = item.price;
                       const percentageOff = calculatePercentageOff(originalPrice, salePrice);
                return(<div key={index} className="card mb-3 border-dark p-3 shadow">
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
                        <span className="m-1 text-muted text-decoration-line-through">₹{originalPrice}</span>
                        <span className="text-success fw-bold bg-success-subtle p-1">{percentageOff}% off</span>
                        <p className="card-text fw-bold ">Quantity: {item?.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>)
               })}

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
                    <span>{subtotal < 299 ? '₹79' : 'Free'}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h5>Total</h5>
                    <h5>₹{subtotal < 299 ? subtotal+79 : subtotal}</h5>
                  </div>
                  <div className="mt-3">
                    <button type="button" className="btn btn-warning btn-block w-100" onClick={handleClick}>
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CheckOut;


// import React, { useEffect, useState } from 'react';
// import { ServerURL } from '../services/baseUrl';
// import './Checkout.css';
// import { addOrderApi, getCartItemApi } from '../services/allApi';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// function CheckOut() {
//     const [cartItems, setCartItems] = useState([]);
//     const [subtotal, setSubtotal] = useState(0)
//     const navigate = useNavigate()
//     const [address, setAddress] = useState({
//       email: '',
//       mobile: '',
//       firstname: '',
//       lastname: '',
//       address_line_1: '',
//       address_line_2: '',
//       country:'India',
//       city: '',
//       state: '',
//       zip: '',
//     });

//     const getCartItems = async()=>{
//       const ids = JSON.parse(localStorage.getItem('cartData')) || [];
//       const params = new URLSearchParams();
//       ids.forEach(id => params.append('id', id));
//        const result = await getCartItemApi(params.toString())
//        setCartItems(result?.data)
//        }

//        const handleClick =()=>{
//         handlePayment()
//        }


//      React.useEffect(() => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       document.body.appendChild(script);
//       return () => {
//          document.body.removeChild(script);
//       };
//     }, []);
//       const handlePayment = () => {

//       const options = {
//          key: 'rzp_test_wNhVz81BFxrIrL',
//          amount: parseInt(subtotal) * 100, // amount in paisa
//          currency: 'INR',
//          name: 'MELON MAGNETS',
//          description: 'Purchase course',
//          handler: function (response) {
//             handlePaymentSuccess()
//          },
      
//          theme: {
//             color: '#f9e7d2',
//          },
//          image: 'apple-touch-icon.png'
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open()
//    };

//    const handlePaymentSuccess = async () => {
//     const products = JSON.parse(localStorage.getItem('cartData')) || [];
 
//     const result = await addOrderApi({...address,products,amount:subtotal})
//      console.log(result);
//      if(result.status == 201){
//       localStorage.setItem('cartData', JSON.stringify([]))
//       Swal.fire({
//         icon: "success",
//         title: "Order Placed Successfully",
//         showConfirmButton: false,
//         timer: 1500
//       });
//       navigate('/')
//      }
//    };
  
//        useEffect(()=>{
//         getCartItems()
//       },[])

//       useEffect(()=>{
//         let subtotal = 0
//         cartItems.map(x=>{
//          subtotal+= x.productId.price*x.quantity
//         })
//         setSubtotal(subtotal)
//       },[cartItems])
  
  
//   return (
//     <div className="container my-5" style={{ position: 'relative' , zIndex:'0'}}>
//       <div className="row">
//         <div className="col-md-7">
//           <h2 className="mb-4">Checkout</h2>
//           <div className="card mb-4">
//             <div className="card-body">
//               <h4 className="mb-3">Contact</h4>
//               <form>
//                 <div className="mb-3">
//                   <label htmlFor="contact" className="form-label">
//                     Email 
//                   </label>
//                   <input type="email" className="form-control" id="contact" value={address.email} onChange={(e)=>setAddress({...address,email:e.target.value})} />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="phone" className="form-label">
//                     Phone  
//                   </label>
//                   <input type="tel" className="form-control" id="phone"  value={address.mobile} onChange={(e)=>setAddress({...address,mobile:e.target.value})} />
//                 </div>
//                 {/* <div className="form-check mb-4">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     id="newsOffers"
//                     defaultChecked
//                   />
//                   <label className="form-check-label" htmlFor="newsOffers">
//                     Email me with news and offers
//                   </label>
//                 </div> */}
//               </form>
//             </div>
//           </div>

//           <div className="card mb-4">
//             <div className="card-body">
//               <h4 className="mb-3">Delivery</h4>
//               <form>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="firstName" className="form-label">
//                       First name 
//                     </label>
//                     <input type="text" className="form-control" id="firstName" value={address.firstname} onChange={(e)=>setAddress({...address,firstname:e.target.value})}/>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="lastName" className="form-label">
//                       Last name
//                     </label>
//                     <input type="text" className="form-control" id="lastName" value={address.lastname} onChange={(e)=>setAddress({...address,lastname:e.target.value})}/>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="address" className="form-label">
//                     Address
//                   </label>
//                   <input type="text" className="form-control" id="address" value={address.address_line_1} onChange={(e)=>setAddress({...address,address_line_1:e.target.value})}/>
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="apartment" className="form-label">
//                     Apartment, suite, etc.
//                   </label>
//                   <input type="text" className="form-control" id="apartment" value={address.address_line_2} onChange={(e)=>setAddress({...address,address_line_2:e.target.value})}/>
//                 </div>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label htmlFor="city" className="form-label">
//                       City
//                     </label>
//                     <input type="text" className="form-control" id="city" value={address.city} onChange={(e)=>setAddress({...address,city:e.target.value})} />
//                   </div>
//                   <div className="col-md-3 mb-3">
//                     <label htmlFor="state" className="form-label">
//                       State
//                     </label>
//                     <input type="text" className="form-control" id="state" value={address.state} onChange={(e)=>setAddress({...address,state:e.target.value})} />
//                   </div>
//                   <div className="col-md-3 mb-3">
//                     <label htmlFor="pin" className="form-label">
//                       PIN code
//                     </label>
//                     <input type="text" className="form-control" id="pin" value={address.zip} onChange={(e)=>setAddress({...address,zip:e.target.value})}/>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-5">
//           <div className="sticky-top">
//             <h2 className="mb-4">Order Summary</h2>
//             {cartItems.map((item, index) => (
//               <div key={index} className="card mb-3 border-dark p-3 shadow">
//                 <div className="row g-0">
//                   <div className="col-md-4 col-5 d-flex align-items-center">
//                     <img
//                       src={item?.productId?.image && item?.productId?.image.length > 0 ? `${ServerURL}/uploads/${item?.productId?.image[0]}` : 'placeholder.jpg'}
//                       className="img-fluid rounded"
//                       alt={item?.productId?.name}
//                     />
//                   </div>
//                   <div className="col-md-8 col-7">
//                     <div className="card-body">
//                       <h5 className="card-title text-dark fw-bold">{item?.productId?.name}</h5>
//                       <p className="card-text fw-bold ">₹{item?.price}</p>
//                       <span className='m-1 text-muted text-decoration-line-through'>₹999</span>
//                       <span className='text-success fw-bold bg-success-subtle p-1'>70% off</span>
//                       <p className="card-text fw-bold ">Quantity: {item?.quantity}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <div className="mb-4">
//               <label htmlFor="discountCode" className="form-label">
//                 Discount code
//               </label>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="discountCode"
//                   placeholder="Enter discount code"
//                 />
//                 <button className="btn btn-warning" type="button">
//                   Apply
//                 </button>
//               </div>
//             </div>

//             <div className="card mb-4">
//               <div className="card-body">
//                 <h5 className="mb-3">Order Total</h5>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Subtotal</span>
//                   <span>₹{subtotal}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3">
//                   <span>Shipping</span>
//                   <span>0</span>
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <h5>Total</h5>
//                   <h5>₹{subtotal}</h5>
//                 </div>
//                <div className='mt-3 '>
//                   <button type="button" className="btn btn-warning btn-block w-100" onClick={handleClick}>
//                       Proceed to Payment
//                     </button>
//                </div>
//               </div>
//             </div>

           
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CheckOut;
