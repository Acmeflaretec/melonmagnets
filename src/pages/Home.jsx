import React from 'react'
import NavBar from '../components/NavBar'
import Topnav from '../components/Topnav'
import Product from './Product'
import Footer from '../components/Footer'
import HomeBanners from './HomeBanners'

function Home() {
  return (
    <div>
        <Topnav/>
        <NavBar/>
        <HomeBanners/>
        <Footer/>
    </div>
  )
}

export default Home