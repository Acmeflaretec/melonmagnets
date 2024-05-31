import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Product from './pages/Product'
import PinBadges from './pages/PinBadges'
import WhatsAppButton from './pages/WhatsAppButton'
import BulkOrder from './pages/BulkOrder'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product' element={<Product/>}/>
        <Route path='/pinbadges' element={<PinBadges/>}/>
        <Route path='/bulkorder' element={<BulkOrder/>}/>
      </Routes>
      <WhatsAppButton/>
    </>
  )
}

export default App
