// import { Route, Routes } from 'react-router-dom'
// import './App.css'
// import Footer from './components/Footer'
// import NavBar from './components/NavBar'
// import Topnav from './components/Topnav'
// import AboutUs from './pages/AboutUs'
// import AllProducts from './pages/AllProducts'
// import BulkOrder from './pages/BulkOrder'
// import CancellationRefunds from './pages/CancellationRefunds'
// import CheckOut from './pages/CheckOut'
// import NotFound from './pages/NotFound'
// import PinBadgeSingle from './pages/PinBadgeSingle'
// import PinBadges from './pages/PinBadges'
// import PrivacyPolicy from './pages/PrivacyPolicy'
// import Product from './pages/Product'
// import ReturnPolicy from './pages/ReturnPolicy'
// import StorePolicy from './pages/StorePolicy'
// import TermsOfService from './pages/TermsOfServicce'
// import WhatsAppButton from './pages/WhatsAppButton'
// import Login from './pages/Login'
// import Register from './pages/Register'

// function App() {

//   return (
//     <>
//       <Topnav />
//       <NavBar />
//       <Routes>
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/' element={<Product />} />
//         <Route path='/:id' element={<Product />} />
//         <Route path='/pinbagesmain' element={<PinBadges />} />
//         <Route path='/pinbadges/:id' element={<PinBadgeSingle />} />
//         <Route path='/bulkorder' element={<BulkOrder />} />
//         <Route path='/checkout' element={<CheckOut />} />
//         <Route path='/aboutus' element={<AboutUs />} />
//         <Route path='/privacypolicy' element={<PrivacyPolicy />} />
//         <Route path='/cancellation' element={<CancellationRefunds />} />
//         <Route path='/returnpolicy' element={<ReturnPolicy />} />
//         <Route path='/storepolicy' element={<StorePolicy />} />
//         <Route path='/termsofservice' element={<TermsOfService />} />
//         <Route path='/allproducts' element={<AllProducts />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <WhatsAppButton />
//       <Footer />
//     </>
//   )
// }

// export default App





import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Topnav from './components/Topnav';
import AboutUs from './pages/AboutUs';
import AllProducts from './pages/AllProducts';
import BulkOrder from './pages/BulkOrder';
import CancellationRefunds from './pages/CancellationRefunds';
import CheckOut from './pages/CheckOut';
import NotFound from './pages/NotFound';
import PinBadgeSingle from './pages/PinBadgeSingle';
import PinBadges from './pages/PinBadges';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Product from './pages/Product';
import ReturnPolicy from './pages/ReturnPolicy';
import StorePolicy from './pages/StorePolicy';
import TermsOfService from './pages/TermsOfServicce';
import WhatsAppButton from './pages/WhatsAppButton';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginRegisterLayout from './components/LoginRegisterLayout';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from './axios'
import { setUserDetails, clearUserDetails } from './redux/actions/userActions';




function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem('Tokens');
  console.log('token1-',token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/auth/user');
      //  console.log(response.data.data)
        dispatch(setUserDetails(response.data.data));
      } catch (error) {
        console.log('errr', error);
        dispatch(clearUserDetails());
      }
    };
    fetchData();
  }, [token]);

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      
        <Routes>
          <Route path='/login' element={<LoginRegisterLayout><Login /></LoginRegisterLayout>} />
          <Route path='/register' element={<LoginRegisterLayout><Register /></LoginRegisterLayout>} />
          <Route path='/' element={<><Topnav /><NavBar /><Product /><WhatsAppButton /><Footer /></>} />
          <Route path='/:id' element={<><Topnav /><NavBar /><Product /><WhatsAppButton /><Footer /></>} />
          <Route path='/products/:id' element={<><Topnav /><NavBar /><PinBadges /><WhatsAppButton /><Footer /></>} />
          <Route path='/productdetails/:id' element={<><Topnav /><NavBar /><PinBadgeSingle /><WhatsAppButton /><Footer /></>} />
          <Route path='/bulkorder' element={<><Topnav /><NavBar /><BulkOrder /><WhatsAppButton /><Footer /></>} />
          <Route path='/checkout' element={<><CheckOut /></>} />
          <Route path='/aboutus' element={<><Topnav /><NavBar /><AboutUs /><WhatsAppButton /><Footer /></>} />
          <Route path='/privacypolicy' element={<><Topnav /><NavBar /><PrivacyPolicy /><WhatsAppButton /><Footer /></>} />
          <Route path='/cancellation' element={<><Topnav /><NavBar /><CancellationRefunds /><WhatsAppButton /><Footer /></>} />
          <Route path='/returnpolicy' element={<><Topnav /><NavBar /><ReturnPolicy /><WhatsAppButton /><Footer /></>} />
          <Route path='/storepolicy' element={<><Topnav /><NavBar /><StorePolicy /><WhatsAppButton /><Footer /></>} />
          <Route path='/termsofservice' element={<><Topnav /><NavBar /><TermsOfService /><WhatsAppButton /><Footer /></>} />
          <Route path='/allproducts' element={<><Topnav /><NavBar /><AllProducts /><WhatsAppButton /><Footer /></>} />
          <Route path="*" element={<><Topnav /><NavBar /><NotFound /><WhatsAppButton /><Footer /></>} />
        </Routes>
      
    </>
  );
}

export default App;
