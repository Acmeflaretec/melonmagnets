import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Topnav from './components/Topnav'
import AboutUs from './pages/AboutUs'
import AllProducts from './pages/AllProducts'
import BulkOrder from './pages/BulkOrder'
import CancellationRefunds from './pages/CancellationRefunds'
import CheckOut from './pages/CheckOut'
import NotFound from './pages/NotFound'
import PinBadgeSingle from './pages/PinBadgeSingle'
import PinBadges from './pages/PinBadges'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Product from './pages/Product'
import ReturnPolicy from './pages/ReturnPolicy'
import StorePolicy from './pages/StorePolicy'
import TermsOfService from './pages/TermsOfServicce'
import WhatsAppButton from './pages/WhatsAppButton'

function App() {

  return (
    <>
      <Topnav/>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Product />} />
        <Route path='/:id' element={<Product />} />
        <Route path='/pinbagesmain' element={<PinBadges/>}/>
        <Route path='/pinbadges/:id' element={<PinBadgeSingle/>}/>
        <Route path='/bulkorder' element={<BulkOrder/>}/>
        <Route path='/checkout' element={<CheckOut/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
        <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
        <Route path='/cancellation' element={<CancellationRefunds/>}/>
        <Route path='/returnpolicy' element={<ReturnPolicy/>}/>
        <Route path='/storepolicy' element={<StorePolicy/>}/>
        <Route path='/termsofservice' element={<TermsOfService/>}/>
        <Route path='/allproducts' element={<AllProducts/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton/>
      <Footer/>
    </>
  )
}

export default App
