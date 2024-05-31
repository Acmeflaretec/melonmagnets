import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HomeBanners() {
  return (
    <div>
        <div className='container'>
            <Row>
                <Col md={6}>
                 <img src="https://m.media-amazon.com/images/I/61NZJpYe0nL._AC_UF894,1000_QL80_.jpg" alt="" style={{width:'100%'}} /> 
                </Col>
                <Col md={6}>
                  <div className='d-flex justify-content-center align-items-center ' style={{height:'100%'}}>
                    <div>
                        <h4 className='display-4 fw-bold mb-3 mt-3 '>Fridge Magnets</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet veritatis exercitationem ut vero vitae amet, aliquam quia. Eaque debitis repellendus quibusdam laudantium iusto corrupti veritatis quas dicta, sequi vitae magnam.</p>
                       <Link to={'/product'}> <button className='btn btn-outline-dark '>Explore Now</button></Link>
                    </div>
                  </div>
                </Col>
            </Row>
            <Row className='mt-5 mb-5 '>
                <Col md={6}>
                  <div className='d-flex justify-content-center align-items-center ' style={{height:'100%'}}>
                    <div>
                        <h4 className='display-4 fw-bold mb-3'>Pin Badges</h4>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis ipsam deleniti sint amet tempora harum sunt assumenda, facilis dignissimos culpa omnis voluptates fuga! Odit voluptas distinctio perspiciatis eligendi accusantium illo?</p>
                       <Link to={'/pinbadges'}> <button className='btn btn-outline-dark '>Explore Now</button></Link>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                 <img src="https://m.media-amazon.com/images/I/71CDEH-B1LL.jpg" alt="" style={{width:'100%'}} /> 
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                 <img src="https://m.media-amazon.com/images/I/71-+WakO6tL._AC_UF894,1000_QL80_.jpg" alt="" style={{width:'100%'}} /> 
                </Col>
                <Col md={6}>
                  <div className='d-flex justify-content-center align-items-center ' style={{height:'100%'}}>
                    <div>
                        <h4 className='display-4 fw-bold mb-3 mt-3 '>Thin Magnets</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita praesentium nihil placeat excepturi blanditiis, at perspiciatis ipsa officia vero fuga autem illo pariatur ullam inventore! Eius, officia sed? Optio, molestiae!</p>
                       <Link to={'/product'}> <button className='btn btn-outline-dark '>Explore Now</button></Link>
                    </div>
                  </div>
                </Col>
            </Row>
        </div>
    </div>
  )
}

export default HomeBanners