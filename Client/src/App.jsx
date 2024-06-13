import { Route, Routes } from 'react-router-dom'
import './App.css'
import BulkOrder from './pages/BulkOrder'
import PinBadges from './pages/PinBadges'
import Product from './pages/Product'
import WhatsAppButton from './pages/WhatsAppButton'
import CheckOut from './pages/CheckOut'
import Topnav from './components/Topnav'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PinBadgeSingle from './pages/PinBadgeSingle'
import AboutUs from './pages/AboutUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CancellationRefunds from './pages/CancellationRefunds'
import ReturnPolicy from './pages/ReturnPolicy'
import StorePolicy from './pages/StorePolicy'

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
      </Routes>
      <WhatsAppButton/>
      <Footer/>
    </>
  )
}

export default App
